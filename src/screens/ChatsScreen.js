import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { counterpart, formatChatTime, loadAllThreads } from '../utils/chat';
import { colors, radius, spacing, typography } from '../theme';

// List of conversations. A customer sees the shops they wrote to; a shop
// owner also sees the customers who wrote to their shop.
const ChatsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setItems(await loadAllThreads());
    } catch (e) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]));

  const renderItem = ({ item }) => {
    const other = counterpart(item);
    const unread = (item.unread || 0) > 0;
    return (
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChatThread', { conversation: item })}>
        {other.image ? (
          <Image style={styles.avatar} source={{ uri: other.image }} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name={other.icon} size={22} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{other.name || t('common.user')}</Text>
            <Text style={styles.time}>{formatChatTime(item.last_message?.created_at || item.last_message_at || item.created_at)}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={[styles.preview, unread && styles.previewUnread]} numberOfLines={1}>
              {item.last_message
                ? `${item.last_message.sender_type === item.side ? t('chat.you') + ': ' : ''}${item.last_message.body}`
                : t('chat.noMessages')}
            </Text>
            {unread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread > 9 ? '9+' : item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Text style={styles.screenTitle}>{t('chat.title')}</Text>
      {isLoading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.side}-${item.id}`}
          contentContainerStyle={items.length === 0 ? styles.center : styles.list}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={56} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>{t('chat.empty')}</Text>
              <Text style={styles.emptySubtitle}>{t('chat.emptySubtitle')}</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screenTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  center: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyBox: { alignItems: 'center' },
  emptyTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.semibold, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { fontSize: typography.size.sm, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { flex: 1, fontSize: typography.size.md, fontWeight: typography.weight.semibold, color: colors.text },
  time: { fontSize: typography.size.xs, color: colors.textMuted },
  preview: { flex: 1, fontSize: typography.size.sm, color: colors.textMuted },
  previewUnread: { color: colors.text, fontWeight: typography.weight.semibold },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.textInverse, fontSize: typography.size.xs, fontWeight: typography.weight.bold },
});
