import { apiRequest } from '../config/api';

// Chat threads come from two endpoints that share one payload shape:
//   /me/chats   — threads where the current user is the customer (side "user")
//   /shop/chats — threads of the shop the current user owns   (side "shop")
// A thread object in the app is the API payload plus `side`.
export const chatBase = (thread) => (thread.side === 'shop' ? `/shop/chats/${thread.id}` : `/me/chats/${thread.id}`);

export const isMine = (message, thread) => message.sender_type === thread.side;

// Name and avatar of "the other side" as the current user sees the thread.
export const counterpart = (thread) =>
  thread.side === 'shop'
    ? { name: thread.user?.name, image: thread.user?.image, icon: 'person-outline' }
    : { name: thread.shop?.name, image: thread.shop?.image, icon: 'storefront-outline' };

// Opens (or reopens) the caller's thread with a shop and navigates to it.
export const openChatWithShop = async (navigation, shopId) => {
  const json = await apiRequest('/me/chats', { method: 'POST', body: { shop_id: shopId } });
  const thread = { ...json.data, side: 'user' };
  navigation.navigate('ChatThread', { conversation: thread });
  return thread;
};

// All threads of the current user: as a customer, and as a shop owner when
// they have a shop. The shop endpoint answers 403 for everyone else; after
// the first 403 it is not asked again until the next login.
let shopChatsAvailable = true;
export const resetChatCache = () => { shopChatsAvailable = true; };

const loadShopThreads = async () => {
  if (!shopChatsAvailable) return [];
  try {
    const json = await apiRequest('/shop/chats');
    return (json.data || []).map((t) => ({ ...t, side: 'shop' }));
  } catch (e) {
    if (/do not have a shop/i.test(e.message || '')) shopChatsAvailable = false;
    return [];
  }
};

export const loadAllThreads = async () => {
  const [mine, shop] = await Promise.all([
    apiRequest('/me/chats').then((j) => (j.data || []).map((t) => ({ ...t, side: 'user' }))),
    loadShopThreads(),
  ]);
  const time = (t) => new Date(t.last_message_at || t.created_at).getTime() || 0;
  return [...mine, ...shop].sort((a, b) => time(b) - time(a));
};

export const formatChatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (date.toDateString() === now.toDateString()) return time;
  const day = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `${day} ${time}`;
};
