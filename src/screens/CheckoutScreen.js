import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiRequest } from '../config/api';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, radius, spacing, typography } from '../theme';

const WEEKDAYS = ['Ýekşenbe', 'Duşenbe', 'Sişenbe', 'Çarşenbe', 'Penşenbe', 'Anna', 'Şenbe'];

const TIME_SLOTS = [
  { label: '09:00 - 11:00', startHour: 9 },
  { label: '11:00 - 13:00', startHour: 11 },
  { label: '13:00 - 15:00', startHour: 13 },
  { label: '15:00 - 17:00', startHour: 15 },
  { label: '17:00 - 19:00', startHour: 17 },
  { label: '19:00 - 21:00', startHour: 19 },
];

const buildDayOptions = () => {
  const now = new Date();
  return [0, 1, 2].map((offset) => {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    let label;
    if (offset === 0) label = 'Şu gün';
    else if (offset === 1) label = 'Ertir';
    else label = WEEKDAYS[date.getDay()];
    return { date, label, isToday: offset === 0 };
  });
};

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { items = [], total = 0 } = route.params || {};

  const dayOptions = useMemo(() => buildDayOptions(), []);
  const now = new Date();

  const [recipientPhone, setRecipientPhone] = useState(user?.phone_number || '');
  const [deliveryType, setDeliveryType] = useState('asap');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = useMemo(() => {
    const day = dayOptions[selectedDayIndex];
    if (!day.isToday) return TIME_SLOTS;
    return TIME_SLOTS.filter((slot) => slot.startHour > now.getHours());
  }, [selectedDayIndex]);

  const onSubmit = async () => {
    if (!recipientPhone.trim()) {
      setError('Eltip beriljek adamyň telefon belgisini giriziň');
      return;
    }
    if (deliveryType === 'scheduled' && !selectedSlot) {
      setError('Eltip bermek wagtyny saýlaň');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      let scheduledAt;
      if (deliveryType === 'scheduled') {
        const day = dayOptions[selectedDayIndex].date;
        const dateTime = new Date(day);
        dateTime.setHours(selectedSlot.startHour, 0, 0, 0);
        scheduledAt = dateTime.toISOString();
      }

      const data = await apiRequest('/orders', {
        method: 'POST',
        body: {
          delivery_type: deliveryType,
          scheduled_at: scheduledAt,
          recipient_phone: recipientPhone,
          note: note.trim() || undefined,
        },
      });

      if (data.success) {
        navigation.navigate('OrderSuccess', { order: data.order });
      } else {
        setError(data.message || 'Sargyt döredip bolmady');
      }
    } catch (e) {
      setError(e.message || 'Näsazlyk ýüze çykdy. Gaýtadan synanyşyň.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Sargyty resmileşdirmek</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{items.length} haryt</Text>
          <Text style={styles.summaryTotal}>{Math.floor(total)} TMT</Text>
        </View>

        <CustomInput
          label="Eltip beriljek adamyň telefony"
          placeholder="65656585"
          value={recipientPhone}
          setValue={(v) => { setRecipientPhone(v); setError(''); }}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Eltip bermek wagty</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeChip, deliveryType === 'asap' && styles.typeChipActive]}
            onPress={() => { setDeliveryType('asap'); setError(''); }}
          >
            <Text style={[styles.typeChipText, deliveryType === 'asap' && styles.typeChipTextActive]}>
              Häzir eltip beriň
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeChip, deliveryType === 'scheduled' && styles.typeChipActive]}
            onPress={() => { setDeliveryType('scheduled'); setError(''); }}
          >
            <Text style={[styles.typeChipText, deliveryType === 'scheduled' && styles.typeChipTextActive]}>
              Wagt saýlaň
            </Text>
          </TouchableOpacity>
        </View>

        {deliveryType === 'scheduled' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
              {dayOptions.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayChip, selectedDayIndex === index && styles.dayChipActive]}
                  onPress={() => { setSelectedDayIndex(index); setSelectedSlot(null); }}
                >
                  <Text style={[styles.dayChipText, selectedDayIndex === index && styles.dayChipTextActive]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.slotGrid}>
              {availableSlots.length === 0 ? (
                <Text style={styles.noSlotsText}>Şu güne wagt galmady, başga gün saýlaň</Text>
              ) : (
                availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.label}
                    style={[styles.slotChip, selectedSlot?.label === slot.label && styles.slotChipActive]}
                    onPress={() => { setSelectedSlot(slot); setError(''); }}
                  >
                    <Text style={[styles.slotChipText, selectedSlot?.label === slot.label && styles.slotChipTextActive]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}

        <CustomInput
          label="Bellik (islege görä)"
          placeholder="Mysal: gapydaky jaň işlänok"
          value={note}
          setValue={setNote}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <CustomButton text="Sargyty tassyklaň" onPress={onSubmit} loading={isSubmitting} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  summaryTotal: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  typeChipTextActive: {
    color: colors.textInverse,
  },
  dayScroll: {
    marginBottom: spacing.md,
  },
  dayChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  dayChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayChipText: {
    fontSize: typography.size.sm,
    color: colors.text,
  },
  dayChipTextActive: {
    color: colors.textInverse,
    fontWeight: typography.weight.semibold,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  slotChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotChipText: {
    fontSize: typography.size.sm,
    color: colors.text,
  },
  slotChipTextActive: {
    color: colors.textInverse,
    fontWeight: typography.weight.semibold,
  },
  noSlotsText: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.sm,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
