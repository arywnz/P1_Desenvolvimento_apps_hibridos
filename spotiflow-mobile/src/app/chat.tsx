import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
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
import { type ChatMessage, DIRECT_MESSAGES } from '../constants/mockData';
import {
  Radius,
  Spacing,
  type ThemeColors,
  type ThemeTypography,
} from '../constants/theme';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, typography } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, typography),
    [colors, typography]
  );
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
            tintColor={colors.textPrimary}
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
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 12 })}
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

                  {/* Card de Música Compartilhada */}
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
                        tintColor={colors.primary}
                        type="hierarchical"
                      />
                    </Pressable>
                  )}

                  <Text
                    style={[
                      styles.messageTime,
                      isMe && styles.messageTimeMe,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Barra de Digitação */}
        <View
          style={[
            styles.inputBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Enviar uma mensagem..."
            placeholderTextColor={colors.textMuted}
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
              tintColor={
                inputText.trim().length > 0
                  ? colors.onPrimary
                  : colors.textMuted
              }
              type="hierarchical"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, typography: ThemeTypography) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      ...typography.bodyMedium,
      fontWeight: '700',
      fontSize: 15,
    },
    headerStatus: {
      ...typography.caption,
      color: colors.primary,
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
      backgroundColor: colors.primary,
      borderBottomRightRadius: Radius.xs,
    },
    bubbleThem: {
      backgroundColor: colors.backgroundElevated,
      borderBottomLeftRadius: Radius.xs,
    },
    messageText: {
      ...typography.bodyMedium,
      fontSize: 14,
      lineHeight: 19,
    },
    messageTextMe: {
      color: colors.bubbleMeText,
      fontWeight: '600',
    },
    messageTextThem: {
      color: colors.textPrimary,
    },
    sharedTrackCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.sharedTrackBg,
      borderRadius: Radius.md,
      padding: Spacing.sm,
      marginTop: 8,
      gap: Spacing.sm,
    },
    sharedCover: {
      width: 44,
      height: 44,
      borderRadius: Radius.xs,
    },
    sharedInfo: {
      flex: 1,
    },
    sharedTitle: {
      ...typography.bodySmall,
      color: colors.badgeText,
      fontWeight: '700',
    },
    sharedArtist: {
      ...typography.caption,
      color: colors.playerTextSecondary,
    },
    messageTime: {
      ...typography.caption,
      fontSize: 10,
      color: colors.bubbleTimeText,
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    messageTimeMe: {
      color: colors.bubbleMeText,
      opacity: 0.75,
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      gap: Spacing.sm,
    },
    input: {
      flex: 1,
      height: 42,
      backgroundColor: colors.backgroundCard,
      borderRadius: Radius.pill,
      paddingHorizontal: Spacing.md,
      color: colors.textPrimary,
      fontSize: 14,
    },
    sendButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.backgroundCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonActive: {
      backgroundColor: colors.primary,
    },
  });
}
