/**
 * Dados simulados (mock) para a aplicação Spotiflow
 * Baseado fielmente nos elementos de tela do Spotify
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  liked: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  isMixed?: boolean;
  isPinned?: boolean;
  isDownloaded?: boolean;
  tracksCount: number;
  tracks: Track[];
}

export interface Category {
  id: string;
  title: string;
  color: string;
  imageUrl: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatarUrl: string;
  currentTrack?: string;
  currentArtist?: string;
  lastActive: string;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  avatarUrl: string;
  previewText: string;
  date: string;
}

// Faixa atual em reprodução (conforme o mini player dos prints)
export const CURRENT_TRACK: Track = {
  id: 'cazuza-exagerado',
  title: 'Exagerado',
  artist: 'Cazuza',
  album: 'Exagerado',
  duration: '3:34',
  durationSeconds: 214,
  coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
  liked: true,
};

// Playlists da Home e Biblioteca
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'echos-of-us',
    title: 'Echos of us',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 38,
    tracks: [
      CURRENT_TRACK,
      {
        id: 'track-2',
        title: 'Codinome Beija-Flor',
        artist: 'Cazuza',
        album: 'Cazuza',
        duration: '2:32',
        durationSeconds: 152,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
        liked: true,
      },
      {
        id: 'track-3',
        title: 'O Tempo Não Pára',
        artist: 'Cazuza',
        album: 'O Tempo Não Pára',
        duration: '4:38',
        durationSeconds: 278,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
        liked: false,
      },
      {
        id: 'track-4',
        title: 'Ideologia',
        artist: 'Cazuza',
        album: 'Ideologia',
        duration: '4:06',
        durationSeconds: 246,
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
        liked: true,
      },
    ],
  },
  {
    id: 'my-peace',
    title: 'My peace',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
    isPinned: true,
    isDownloaded: true,
    tracksCount: 24,
    tracks: [],
  },
  {
    id: 'on-my-mind',
    title: 'on my mind',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 42,
    tracks: [],
  },
  {
    id: 'dyanassics-jao',
    title: 'Dyanassics + Jão',
    subtitle: 'Playlist • Spotify Match',
    author: 'Spotify',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
    isDownloaded: false,
    tracksCount: 50,
    tracks: [],
  },
  {
    id: 'liked-songs',
    title: 'Músicas curtidas',
    subtitle: 'Playlist • 142 músicas',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80',
    isDownloaded: true,
    tracksCount: 142,
    tracks: [],
  },
  {
    id: 'kpop-crl',
    title: 'kpop e os crl',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    isDownloaded: false,
    tracksCount: 65,
    tracks: [],
  },
];

// Categorias e Gêneros da Tela de Busca
export const SEARCH_CATEGORIES: Category[] = [
  { id: 'musica', title: 'Música', color: '#E8115B', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80' },
  { id: 'podcasts', title: 'Podcasts', color: '#148A08', imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80' },
  { id: 'eventos', title: 'Eventos ao vivo', color: '#7358FF', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'fitness', title: 'Fitness', color: '#503750', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&q=80' },
  { id: 'brasil', title: 'Feito para você', color: '#1E3264', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80' },
  { id: 'radar', title: 'Próximos lançamentos', color: '#006450', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80' },
  { id: 'rock', title: 'Rock', color: '#BC5900', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&q=80' },
  { id: 'mpb', title: 'MPB', color: '#E91429', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80' },
];

// Usuário logado
export const USER_PROFILE = {
  name: 'Jão',
  plan: 'Universitário',
  avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80', // gatinho neutro de alta qualidade
};

// Amigos e Atividades (nomes normais e reais)
export const FRIENDS_ACTIVITY: FriendActivity[] = [
  {
    id: 'friend-1',
    name: 'Gabriela',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    currentTrack: 'sangrar',
    currentArtist: 'Arthur',
    lastActive: 'Ouvindo agora',
  },
  {
    id: 'friend-2',
    name: 'João Victor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    currentTrack: 'Lucia',
    currentArtist: 'Milo J',
    lastActive: 'Há 12 min',
  },
  {
    id: 'friend-3',
    name: 'Camila',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    currentTrack: 'SaWaDiKa',
    currentArtist: 'Fic',
    lastActive: 'Há 1h',
  },
  {
    id: 'friend-4',
    name: 'Lucas Ferreira',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    lastActive: 'Ativado',
  },
];

// Mensagens diretas (nomes normais e reais)
export const DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-1',
    senderName: 'Mariana Costa',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    previewText: 'compartilhou 1 música',
    date: '8 de abr.',
  },
  {
    id: 'dm-2',
    senderName: 'Felipe Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
    previewText: 'Enviou uma recomendação',
    date: '7 de mar.',
  },
];
