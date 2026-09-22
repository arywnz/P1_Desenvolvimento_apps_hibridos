import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatMessage, CURRENT_TRACK, DIRECT_MESSAGES } from '../constants/mockData';
import { Colors, Spacing, Typography } from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = usePlayer();

  const conversation =
    DIRECT_MESSAGES.find((dm) => dm.id === id) || DIRECT_MESSAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: 'Agora',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header do Chat com Foto e Nome */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <SymbolView
            name={{
              ios: 'chevron.backward',
              android: 'arrow_back',
              web: 'arrow_back',
            }}
            size={24}
            tintColor={Colors.textPrimary}
            type="hierarchical"
          />
        </Pressable>

        <Image
          source={conversation.avatarSource ?? { uri: conversation.avatarUrl }}
          style={styles.headerAvatar}
          contentFit="cover"
        />

        <View style={styles.headerTextGroup}>
          <Text style={styles.headerName}>{conversation.senderName}</Text>
          <Text style={styles.headerStatus}>Online no Spotify</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Lista de Mensagens */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messageList, { paddingBottom: 16 }]}
          renderItem={({ item }) => {
            const isMe = item.sender === 'me';

            return (
              <View
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.bubbleRight : styles.bubbleLeft,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : styles.messageTextThem,
                    ]}
                  >
                    {item.text}
                  </Text>

                  {/* Card de Música Compartilhada (se houver) */}
                  {item.sharedTrack && (
                    <Pressable
                      style={styles.sharedTrackCard}
                      onPress={() => playTrack(item.sharedTrack!)}
                      accessibilityRole="button"
                      accessibilityLabel={`Tocar ${item.sharedTrack.title}`}
                    >
                      <Image
                        source={{ uri: item.sharedTrack.coverUrl }}
                        style={styles.sharedCover}
                        contentFit="cover"
                      />
                      <View style={styles.sharedInfo}>
                        <Text style={styles.sharedTitle} numberOfLines={1}>
                          {item.sharedTrack.title}
                        </Text>
                        <Text style={styles.sharedArtist} numberOfLines={1}>
                          {item.sharedTrack.artist}
                        </Text>
                      </View>
                      <SymbolView
                        name={{
                          ios: 'play.circle.fill',
                          android: 'play_circle',
                          web: 'play_circle',
                        }}
                        size={28}
                        tintColor={Colors.primary}
                        type="hierarchical"
                      />
                    </Pressable>
                  )}

                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Barra de Digitação */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            placeholder="Enviar uma mensagem..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
          />
          <Pressable
            style={[
              styles.sendButton,
              inputText.trim().length > 0 && styles.sendButtonActive,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem"
          >
            <SymbolView
              name={{
                ios: 'paperplane.fill',
                android: 'send',
                web: 'send',
              }}
              size={18}
              tintColor={inputText.trim().length > 0 ? Colors.background : Colors.textMuted}
              type="hierarchical"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: Spacing.xs,
  },
  headerTextGroup: {
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  headerName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    fontSize: 15,
  },
  headerStatus: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 11,
  },
  keyboardContainer: {
    flex: 1,
  },
  messageList: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  messageBubbleWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  bubbleRight: {
    justifyContent: 'flex-end',
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.backgroundElevated,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...Typography.bodyMedium,
    fontSize: 14,
    lineHeight: 19,
  },
  messageTextMe: {
    color: '#000000',
    fontWeight: '600',
  },
  messageTextThem: {
    color: Colors.textPrimary,
  },
  sharedTrackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: Spacing.sm,
    marginTop: 8,
    gap: Spacing.sm,
  },
  sharedCover: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
  sharedInfo: {
    flex: 1,
  },
  sharedTitle: {
    ...Typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sharedArtist: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  messageTime: {
    ...Typography.caption,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 21,
    paddingHorizontal: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});
