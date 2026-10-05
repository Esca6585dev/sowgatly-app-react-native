import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { chatBase, counterpart, formatChatTime, isMine } from '../utils/chat';
import { colors, radius, spacing, typography } from '../theme';

const POLL_MS = 4000;

// One chat thread (route "ChatThread"). Messages are fetched oldest-first and
// shown in an inverted list; new ones arrive by polling with ?after=.
// The thread comes from /me/chats (side "user") or /shop/chats (side "shop").
const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const conversation = route.params.conversation;
  const other = counterpart(conversation);
  const base = chatBase(conversation);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const lastIdRef = useRef(0);

  const markRead = useCallback(() => {
    apiRequest(`${base}/read`, { method: 'POST' }).catch(() => {});
  }, [base]);

  const merge = useCallback((incoming) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const known = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !known.has(m.id));
      if (!fresh.length) return prev;
      const next = [...prev, ...fresh].sort((a, b) => a.id - b.id);
      lastIdRef.current = next[next.length - 1].id;
      return next;
    });
    // Anything the other side wrote is read now that it is on screen.
    if (incoming.some((m) => !isMine(m, conversation))) markRead();
  }, [conversation, markRead]);

  const fetchMessages = useCallback(async () => {
    try {
      const query = lastIdRef.current ? `?after=${lastIdRef.current}` : '?limit=100';
      const json = await apiRequest(`${base}/messages${query}`);
      merge(json.data || []);
    } catch (e) {
      // keep what we have; the next poll retries
    } finally {
      setIsLoading(false);
    }
  }, [base, merge]);

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, POLL_MS);
    return () => clearInterval(timer);
  }, [fetchMessages]);

  const send = async () => {
    const body = text.trim();
    if (!body || isSending) return;
    setIsSending(true);
    try {
      const json = await apiRequest(`${base}/messages`, { method: 'POST', body: { body } });
      merge([json.data]);
      setText('');
    } catch (e) {
      // leave the text in the input so the user can retry
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }) => {
    const mine = isMine(item, conversation);
    return (
      <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{item.body}</Text>
          <Text style={[styles.bubbleTime, mine && styles.bubbleTimeMine]}>{formatChatTime(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{other.name || t('common.user')}</Text>
          <Text style={styles.subtitle}>{conversation.side === 'shop' ? t('chat.customer') : t('product.shop')}</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        {isLoading ? (
          <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
        ) : (
          <FlatList
            data={[...messages].reverse()}
            inverted
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyInverted}>
                <Text style={styles.emptyText}>{t('chat.start', { name: other.name || '' })}</Text>
              </View>
            }
          />
        )}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!text.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={send}
            disabled={!text.trim() || isSending}
            accessibilityLabel={t('chat.send')}
          >
            {isSending ? <ActivityIndicator color={colors.textInverse} /> : <Ionicons name="send" size={18} color={colors.textInverse} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, alignItems: 'center' },
  title: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text },
  subtitle: { fontSize: typography.size.xs, color: colors.textMuted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.lg, gap: spacing.sm },
  emptyInverted: { transform: [{ scaleY: -1 }], alignItems: 'center', paddingVertical: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: typography.size.sm, textAlign: 'center' },
  bubbleRow: { flexDirection: 'row' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubbleRowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: radius.sm },
  bubbleTheirs: { backgroundColor: colors.surface, borderBottomLeftRadius: radius.sm },
  bubbleText: { fontSize: typography.size.md, color: colors.text, lineHeight: 22 },
  bubbleTextMine: { color: colors.textInverse },
  bubbleTime: { fontSize: typography.size.xs, color: colors.textMuted, marginTop: 2, alignSelf: 'flex-end' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.7)' },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.size.md,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.4 },
});
