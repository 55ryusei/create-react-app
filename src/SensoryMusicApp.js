import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Search,
  Volume2,
  Headphones,
  Sparkles,
  Repeat,
  SkipBack,
  SkipForward,
  Menu,
  X,
  Heart,
  Plus,
  List,
  Trash2,
  Edit3,
} from "lucide-react";

const SensoryAudioLibrary = () => {
  // 基本状態の定義
  const [language, setLanguage] = useState("jp"); // 'jp', 'en'

  // 🎵 音源ファイルパス自動生成
  const generateAudioPath = (fileName) => {
    return `/audio/${fileName}`;
  };

  const [tracks, setTracks] = useState([
    // 海・川・水カテゴリー
    {
      id: 1,
      title: "海の波音",
      artist: "自然音",
      duration: "3:24",
      category: "water",
      audioUrl: generateAudioPath("ocean-waves-250310.mp3"),
      actualDuration: null,
    },
    {
      id: 2,
      title: "海の波音2",
      artist: "自然音",
      duration: "5:45",
      category: "water",
      audioUrl: generateAudioPath("ocean-waves-112906.mp3"),
      actualDuration: null,
    },
    {
      id: 3,
      title: "カモメの鳴き声",
      artist: "自然音",
      duration: "2:45",
      category: "water",
      audioUrl: generateAudioPath("sound-effect-seagulls-157829.mp3"),
      actualDuration: null,
    },
    {
      id: 4,
      title: "水の音",
      artist: "自然音",
      duration: "4:15",
      category: "water",
      audioUrl: generateAudioPath("water-333590.mp3"),
      actualDuration: null,
    },

    // 森・動物・虫カテゴリー
    {
      id: 5,
      title: "6月の鳥の声",
      artist: "自然音",
      duration: "5:12",
      category: "forest",
      audioUrl: generateAudioPath("birds-june-17th-2025-361476.mp3"),
      actualDuration: null,
    },
    {
      id: 6,
      title: "森の春の音",
      artist: "自然音",
      duration: "6:30",
      category: "forest",
      audioUrl: generateAudioPath("forrest-field-spring-sounds-5858.mp3"),
      actualDuration: null,
    },
    {
      id: 7,
      title: "森の鳥と葉のざわめき",
      artist: "自然音",
      duration: "4:20",
      category: "forest",
      audioUrl: generateAudioPath(
        "forrest-birds-rustling-leaves-skodsborg02-tbb-67249.mp3"
      ),
      actualDuration: null,
    },
    {
      id: 8,
      title: "コオロギの鳴き声",
      artist: "自然音",
      duration: "8:15",
      category: "forest",
      audioUrl: generateAudioPath(
        "crickets-chirping-with-other-bugs-27217.mp3"
      ),
      actualDuration: null,
    },

    // 雨・嵐・雷カテゴリー
    {
      id: 9,
      title: "穏やかな雨音",
      artist: "自然音",
      duration: "10:00",
      category: "storm",
      audioUrl: generateAudioPath("calming-rain-257596.mp3"),
      actualDuration: null,
    },
    {
      id: 10,
      title: "激しい風の嵐",
      artist: "自然音",
      duration: "4:33",
      category: "storm",
      audioUrl: generateAudioPath("heavy-wind-storm-326096.mp3"),
      actualDuration: null,
    },
    {
      id: 11,
      title: "雨と小さな嵐",
      artist: "自然音",
      duration: "6:45",
      category: "storm",
      audioUrl: generateAudioPath("rain-and-little-storm-298087.mp3"),
      actualDuration: null,
    },
    {
      id: 12,
      title: "雷の風景音",
      artist: "自然音",
      duration: "3:30",
      category: "storm",
      audioUrl: generateAudioPath("lightning-soundscape-52896.mp3"),
      actualDuration: null,
    },
    {
      id: 13,
      title: "雷の音",
      artist: "自然音",
      duration: "2:15",
      category: "storm",
      audioUrl: generateAudioPath("lightning-237994.mp3"),
      actualDuration: null,
    },
  ]);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // プレイリスト機能の状態
  const [playlists, setPlaylists] = useState([
    { id: "favorites", name: "お気に入り", tracks: [], isSystem: true },
  ]);
  const [favorites, setFavorites] = useState(new Set());
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] =
    useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [editingPlaylistName, setEditingPlaylistName] = useState("");

  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeDragging, setIsVolumeDragging] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // 翻訳テキスト
  const translations = {
    jp: {
      title: "Sensory Music",
      subtitle: "センサリープレイのための音源コレクション",
      searchPlaceholder: "海、森、雨などで検索...",
      categories: "カテゴリー",
      allSounds: "すべての音源",
      water: "海・川・水",
      forest: "森・動物・虫",
      storm: "雨・嵐・雷",
      other: "その他",
      play: "再生",
      natural: "自然音",
      noTracks: "該当する音源がありません",
      totalTracks: "音源数",
      highQuality: "高品質音源",
      loading: "読み込み中...",
      fileNotFound: "音源ファイルが見つかりません",
      favorites: "お気に入り",
      playlists: "プレイリスト",
      createPlaylist: "新しいプレイリスト",
      addToPlaylist: "プレイリストに追加",
      removeFromFavorites: "お気に入りから削除",
      addToFavorites: "お気に入りに追加",
      deletePlaylist: "プレイリストを削除",
      editPlaylist: "プレイリスト名を編集",
      playlistName: "プレイリスト名",
      create: "作成",
      cancel: "キャンセル",
      save: "保存",
      delete: "削除",
      noPlaylistTracks: "このプレイリストには音源がありません",
      tracks: "音源",
      localAudio: "ローカル音源",
      // 既存のlocalAudio: "ローカル音源",の後に追加
      repeatMode: "リピートモード",
      repeatOn: "リピートオン",
      repeatOff: "リピートオフ",
      previous: "前の曲",
      next: "次の曲",
      highQualityAudio: "高品質音源",
      removeFromPlaylist: "プレイリストから削除",
    },
    en: {
      title: "Sensory Music",
      subtitle: "Sounds collection for sensory play activities",
      searchPlaceholder: "Search for sea, forest, rain...",
      categories: "Categories",
      allSounds: "All Sounds",
      water: "Sea & Water",
      forest: "Forest & Animals",
      storm: "Rain & Storm",
      other: "Other",
      play: "Play",
      natural: "Natural Sounds",
      noTracks: "No matching audio files",
      totalTracks: "Total Tracks",
      highQuality: "High Quality",
      loading: "Loading...",
      fileNotFound: "Audio file not found",
      favorites: "Favorites",
      playlists: "Playlists",
      createPlaylist: "New Playlist",
      addToPlaylist: "Add to Playlist",
      removeFromFavorites: "Remove from Favorites",
      addToFavorites: "Add to Favorites",
      deletePlaylist: "Delete Playlist",
      editPlaylist: "Edit Playlist Name",
      playlistName: "Playlist Name",
      create: "Create",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      noPlaylistTracks: "No tracks in this playlist",
      tracks: "tracks",
      localAudio: "Local Audio",
      // 既存のlocalAudio: "Local Audio",の後に追加
      repeatMode: "Repeat Mode",
      repeatOn: "Repeat On",
      repeatOff: "Repeat Off",
      previous: "Previous",
      next: "Next",
      highQualityAudio: "High Quality Audio",
      removeFromPlaylist: "Remove from Playlist",
    },
  };

  const t = translations[language];

  // カテゴリー定義
  const categories = [
    {
      id: "all",
      name: t.allSounds,
      icon: "🎵",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      id: "water",
      name: t.water,
      icon: "🌊",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      id: "forest",
      name: t.forest,
      icon: "🌲",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      id: "storm",
      name: t.storm,
      icon: "⛈️",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "other",
      name: t.other,
      icon: "🎶",
      gradient: "from-gray-500 to-gray-400",
    },
  ];
  // 言語変更時のお気に入りプレイリスト名更新
  useEffect(() => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === "favorites"
          ? { ...playlist, name: t.favorites }
          : playlist
      )
    );
  }, [language, t.favorites]);
  // 音源の事前読み込み（再生時間取得）
  useEffect(() => {
    const preloadAudioMetadata = async () => {
      for (const track of tracks) {
        if (!track.actualDuration) {
          try {
            const audio = new Audio();
            await new Promise((resolve) => {
              const handleLoadedMetadata = () => {
                setTracks((prevTracks) =>
                  prevTracks.map((t) =>
                    t.id === track.id
                      ? {
                          ...t,
                          actualDuration: audio.duration,
                          duration: formatTime(audio.duration),
                        }
                      : t
                  )
                );
                resolve();
              };
              const handleError = () => {
                console.warn(`Failed to load metadata for ${track.title}`);
                resolve(); // Continue with next track even on error
              };

              audio.addEventListener("loadedmetadata", handleLoadedMetadata);
              audio.addEventListener("error", handleError);
              audio.src = track.audioUrl;
            });
          } catch (error) {
            console.warn(`Failed to load metadata for ${track.title}:`, error);
          }
        }
      }
    };

    // 少し遅延させて実行（初期レンダリングを優先）
    const timer = setTimeout(preloadAudioMetadata, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 言語に応じてトラック情報を取得
  const getLocalizedTrack = (track) => {
    if (language === "en" && track.id <= 13) {
      const englishTracks = {
        1: { title: "Ocean Waves", artist: "Nature Sounds" },
        2: { title: "Ocean Waves 2", artist: "Nature Sounds" },
        3: { title: "Seagulls Sound Effect", artist: "Nature Sounds" },
        4: { title: "Water", artist: "Nature Sounds" },
        5: { title: "Birds June 17th 2025", artist: "Nature Sounds" },
        6: { title: "Forest Field Spring Sounds", artist: "Nature Sounds" },
        7: { title: "Forest Birds Rustling Leaves", artist: "Nature Sounds" },
        8: { title: "Crickets Chirping", artist: "Nature Sounds" },
        9: { title: "Calming Rain", artist: "Nature Sounds" },
        10: { title: "Heavy Wind Storm", artist: "Nature Sounds" },
        11: { title: "Rain and Little Storm", artist: "Nature Sounds" },
        12: { title: "Lightning Soundscape", artist: "Nature Sounds" },
        13: { title: "Lightning", artist: "Nature Sounds" },
      };
      return { ...track, ...englishTracks[track.id] };
    }
    return track;
  };

  // プレイリスト関数
  const toggleFavorite = (trackId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    setFavorites(newFavorites);

    // お気に入りプレイリストも更新
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === "favorites"
          ? {
              ...playlist,
              tracks: newFavorites.has(trackId)
                ? [...playlist.tracks, trackId]
                : playlist.tracks.filter((id) => id !== trackId),
            }
          : playlist
      )
    );
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: newPlaylistName.trim(),
        tracks: selectedTrackForPlaylist ? [selectedTrackForPlaylist] : [],
        isSystem: false,
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
      setNewPlaylistName("");
      setIsCreatingPlaylist(false);
      setShowCreatePlaylistModal(false);
      if (selectedTrackForPlaylist) {
        setShowPlaylistModal(false);
        setSelectedTrackForPlaylist(null);
      }
    }
  };

  const addToPlaylist = (playlistId, trackId) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.includes(trackId)
                ? playlist.tracks
                : [...playlist.tracks, trackId],
            }
          : playlist
      )
    );
    setShowPlaylistModal(false);
    setSelectedTrackForPlaylist(null);
  };

  const removeFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              tracks: playlist.tracks.filter((id) => id !== trackId),
            }
          : playlist
      )
    );

    if (playlistId === "favorites") {
      const newFavorites = new Set(favorites);
      newFavorites.delete(trackId);
      setFavorites(newFavorites);
    }
  };

  const deletePlaylist = (playlistId) => {
    if (!playlists.find((p) => p.id === playlistId)?.isSystem) {
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      if (currentPlaylist === playlistId) {
        setCurrentPlaylist(null);
        setSelectedCategory("all");
      }
    }
  };

  const editPlaylistName = (playlistId, newName) => {
    if (newName.trim()) {
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, name: newName.trim() }
            : playlist
        )
      );
    }
    setEditingPlaylistId(null);
    setEditingPlaylistName("");
  };

  // フィルタリングされたトラック
  const getFilteredTracks = () => {
    let filteredTracks = tracks;

    // プレイリスト表示の場合
    if (currentPlaylist) {
      const playlist = playlists.find((p) => p.id === currentPlaylist);
      if (playlist) {
        filteredTracks = tracks.filter((track) =>
          playlist.tracks.includes(track.id)
        );
      }
    } else {
      // カテゴリーフィルター
      if (selectedCategory !== "all") {
        filteredTracks = tracks.filter(
          (track) => track.category === selectedCategory
        );
      }
    }

    // 検索フィルター
    if (searchQuery) {
      filteredTracks = filteredTracks.filter((track) => {
        const localizedTrack = getLocalizedTrack(track);
        return (
          localizedTrack.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          track.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filteredTracks;
  };

  const filteredTracks = getFilteredTracks();

  // 時間フォーマット
  const formatTime = (time) => {
    if (isNaN(time) || time === null || time === undefined) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleLanguage = () => {
    setLanguage(language === "jp" ? "en" : "jp");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPlaylist(null);
    // スマホでカテゴリ選択後はサイドバーを閉じる
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const selectPlaylist = (playlistId) => {
    setCurrentPlaylist(playlistId);
    setSelectedCategory("all");
    // スマホでプレイリスト選択後はサイドバーを閉じる
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  // 現在のトラックのインデックスを取得
  const getCurrentTrackIndex = () => {
    return filteredTracks.findIndex((track) => track.id === currentTrack?.id);
  };

  // 次の曲に移動
  const skipToNext = () => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex !== -1 && filteredTracks.length > 0) {
      const nextIndex = (currentIndex + 1) % filteredTracks.length;
      const nextTrack = filteredTracks[nextIndex];
      console.log("⏭️ 次の曲:", nextTrack.title);
      playTrack(nextTrack);
    }
  };

  // 前の曲に移動
  const skipToPrevious = () => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex !== -1 && filteredTracks.length > 0) {
      const prevIndex =
        currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
      const prevTrack = filteredTracks[prevIndex];
      console.log("⏮️ 前の曲:", prevTrack.title);
      playTrack(prevTrack);
    }
  };

  const playTrack = (track) => {
    console.log("🎵 再生開始:", track.title, "URL:", track.audioUrl);

    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setCurrentTrack(track);
      setIsLoading(true);

      if (audioRef.current) {
        // 音源ファイルを設定
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume / 100;

        // 再生可能になったら自動再生
        audioRef.current.oncanplaythrough = () => {
          console.log("✅ 再生準備完了");
          if (audioRef.current) {
            setIsLoading(false);
            setIsPlaying(true);
            audioRef.current
              .play()
              .then(() => {
                console.log("🔊 再生開始成功");
              })
              .catch((err) => {
                console.error("❌ 再生エラー:", err);
                setIsPlaying(false);
                setIsLoading(false);
              });
          }
        };

        // メタデータ読み込み完了時に実際の時間を取得
        audioRef.current.onloadedmetadata = () => {
          if (audioRef.current) {
            const actualDuration = audioRef.current.duration;
            console.log("📊 実際の再生時間:", formatTime(actualDuration));
            setDuration(actualDuration);

            // tracksの時間情報を実際の時間で更新
            setTracks((prevTracks) =>
              prevTracks.map((t) =>
                t.id === track.id
                  ? {
                      ...t,
                      duration: formatTime(actualDuration),
                      actualDuration,
                    }
                  : t
              )
            );
          }
        };

        // エラー処理
        audioRef.current.onerror = (e) => {
          console.error("❌ ファイル読み込みエラー:", track.title, e);
          setIsLoading(false);
          setIsPlaying(false);
          alert(
            `音源ファイルが見つかりません: ${track.title}\n\n${track.audioUrl} を確認してください。`
          );
        };

        // 読み込み開始
        audioRef.current.load();
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("再生エラー:", err);
            setIsPlaying(false);
          });
      }
    }
  };

  // プログレスバーのクリック・ドラッグ処理
  const getProgressFromEvent = (e) => {
    if (!progressRef.current || !duration) return 0;

    const rect = progressRef.current.getBoundingClientRect();
    let clientX;

    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const clickX = clientX - rect.left;
    const width = rect.width;
    const progress = Math.max(0, Math.min(1, clickX / width));
    return progress * duration;
  };

  const handleProgressStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const newTime = getProgressFromEvent(e);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newTime = getProgressFromEvent(e);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // ボリュームバーのクリック・ドラッグ処理
  const getVolumeFromEvent = (e) => {
    if (!volumeRef.current) return 0;

    const rect = volumeRef.current.getBoundingClientRect();
    let clientX;

    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const clickX = clientX - rect.left;
    const width = rect.width;
    const progress = Math.max(0, Math.min(1, clickX / width));
    return Math.round(progress * 100);
  };

  const handleVolumeStart = (e) => {
    e.preventDefault();
    setIsVolumeDragging(true);
    const newVolume = getVolumeFromEvent(e);
    setVolume(newVolume);
  };

  const handleVolumeMove = (e) => {
    if (!isVolumeDragging) return;
    e.preventDefault();
    const newVolume = getVolumeFromEvent(e);
    setVolume(newVolume);
  };

  const handleVolumeEnd = (e) => {
    e.preventDefault();
    setIsVolumeDragging(false);
  };

  // エフェクト
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime || 0);
        }
      };
      const updateDuration = () => setDuration(audio.duration || 0);
      const handleEnded = () => {
        if (isRepeating && currentTrack) {
          // リピートモードの場合は再度再生
          console.log("🔁 リピート再生");
          audio.currentTime = 0;
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error("リピート再生エラー:", err);
              setIsPlaying(false);
            });
        } else {
          // リピートオフの場合は次の曲に移動
          console.log("⏭️ 次の曲に自動移動");
          const currentIndex = filteredTracks.findIndex(
            (track) => track.id === currentTrack?.id
          );
          if (currentIndex !== -1 && currentIndex < filteredTracks.length - 1) {
            // 次の曲がある場合
            const nextTrack = filteredTracks[currentIndex + 1];
            setTimeout(() => playTrack(nextTrack), 500); // 少し遅延を入れて自然な遷移
          } else {
            // 最後の曲の場合は停止
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", handleEnded);

      return () => {
        if (audio) {
          audio.removeEventListener("timeupdate", updateTime);
          audio.removeEventListener("loadedmetadata", updateDuration);
          audio.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [currentTrack, isRepeating, filteredTracks, isDragging, isVolumeDragging]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // ドラッグイベントリスナー
  useEffect(() => {
    const handleMouseMove = (e) => {
      handleProgressMove(e);
      handleVolumeMove(e);
    };
    const handleMouseUp = (e) => {
      handleProgressEnd(e);
      handleVolumeEnd(e);
    };
    const handleTouchMove = (e) => {
      handleProgressMove(e);
      handleVolumeMove(e);
    };
    const handleTouchEnd = (e) => {
      handleProgressEnd(e);
      handleVolumeEnd(e);
    };

    if (isDragging || isVolumeDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, isVolumeDragging]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ウィンドウリサイズ時の処理
  useEffect(() => {
    const handleResize = () => {
      // デスクトップサイズになったらサイドバーを自動で開く
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // デスクトップでは常に表示されるのでstateはfalse
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 入力フィールドにフォーカスがある場合は無視
      if (e.target.tagName === "INPUT") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipToNext();
          break;
        case "KeyR":
          e.preventDefault();
          toggleRepeat();
          break;
        case "KeyM":
          e.preventDefault();
          if (window.innerWidth < 768) {
            toggleSidebar();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentTrack, filteredTracks, isRepeating]);

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen ${
        currentTrack ? "pb-20 md:pb-32" : ""
      }`}
    >
      <audio ref={audioRef} />

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        <div className="relative bg-gradient-to-r from-gray-900 via-purple-900/50 to-gray-900 p-4 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* ハンバーガーメニューボタン (モバイル用) */}
              <button
                onClick={toggleSidebar}
                className="md:hidden bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-2 rounded-lg transition-all duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                {/* 瞑想ロゴ - 完全透過背景 */}
                <img
                  src="https://i.imgur.com/rVJyLeP.png"
                  alt="瞑想ロゴ"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  onError={(e) => {
                    // .pngで失敗した場合は.jpgを試す
                    if (e.target.src.includes(".png")) {
                      e.target.src = "https://i.imgur.com/rVJyLeP.jpg";
                    } else {
                      // 両方失敗した場合はヘッドフォンアイコンに戻す
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }
                  }}
                />
                <div
                  className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                  style={{ display: "none" }}
                >
                  <Headphones className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg leading-tight py-1">
                  {t.title}
                </h1>
                <p className="text-sm md:text-lg bg-gradient-to-r from-cyan-300 via-orange-300 to-purple-400 bg-clip-text text-transparent mt-1 drop-shadow-md leading-relaxed hidden sm:block">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 border border-white/20">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                <span className="text-xs md:text-sm font-medium text-white">
                  {t.highQuality}
                </span>
              </div>
              <button
                onClick={toggleLanguage}
                className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition-all duration-300 hover:scale-105 border border-white/20"
              >
                {language === "jp" ? "EN" : "JP"}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full bg-black/40 backdrop-blur-sm text-white placeholder-gray-400 rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-10 md:pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-black/60 transition-all duration-300 border border-white/20 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Create Playlist Modal */}
            {showCreatePlaylistModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden">
                  <div className="p-4 border-b border-gray-600">
                    <h3 className="text-lg font-semibold text-white">
                      {t.createPlaylist}
                    </h3>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder={t.playlistName}
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="w-full bg-black/40 text-white placeholder-gray-400 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      onKeyPress={(e) => e.key === "Enter" && createPlaylist()}
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={createPlaylist}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition-colors font-medium"
                        disabled={!newPlaylistName.trim()}
                      >
                        {t.create}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreatePlaylistModal(false);
                          setNewPlaylistName("");
                        }}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors font-medium"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/60 backdrop-blur-sm p-3 md:p-4 border-b border-gray-600">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center space-x-4 md:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-200">
                {tracks.length} {t.totalTracks}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200">{t.localAudio}</span>
            </div>
            {isRepeating && (
              <div className="flex items-center space-x-2">
                <Repeat className="w-4 h-4 text-purple-400" />
                <span className="text-gray-200 hidden sm:inline">
                  {t.repeatMode}
                </span>
              </div>
            )}
          </div>
          <div className="text-gray-300">
            {filteredTracks.length} / {tracks.length}
            {currentTrack && (
              <span className="ml-2 md:ml-4 hidden sm:inline">
                再生中: {getCurrentTrackIndex() + 1} / {filteredTracks.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex relative max-w-7xl mx-auto">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
          fixed md:relative 
          top-0 left-0 
          w-80 md:w-80 
          h-full md:h-auto 
          p-4 md:p-6 
          bg-black/90 md:bg-black/30 
          border-r border-gray-600 
          transition-transform duration-300 ease-in-out
          z-50 md:z-auto
          overflow-y-auto
        `}
        >
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
              {t.categories}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <div className="hidden md:block text-gray-300 text-sm font-semibold mb-4 uppercase tracking-wider">
                {t.categories}
              </div>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`group cursor-pointer transition-all duration-300 ${
                      selectedCategory === category.id && !currentPlaylist
                        ? "scale-105"
                        : "hover:scale-102"
                    }`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <div
                      className={`bg-gradient-to-r ${
                        category.gradient
                      } p-3 md:p-4 rounded-2xl shadow-lg relative overflow-hidden border ${
                        selectedCategory === category.id && !currentPlaylist
                          ? "ring-2 ring-white border-white/50"
                          : "border-transparent"
                      }`}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative flex items-center space-x-3">
                        <div className="text-xl md:text-2xl drop-shadow-lg">
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white drop-shadow-md text-sm md:text-base">
                            {category.name}
                          </div>
                          <div className="text-xs md:text-sm text-white/90 drop-shadow-md">
                            {category.id === "all"
                              ? tracks.length
                              : tracks.filter((t) => t.category === category.id)
                                  .length}{" "}
                            {t.tracks}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playlists */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  {t.playlists}
                </div>
                <button
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-1.5 transition-all duration-300 hover:scale-110"
                  title={t.createPlaylist}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {isCreatingPlaylist && (
                <div className="mb-3 p-3 bg-black/40 rounded-xl border border-gray-600">
                  <input
                    type="text"
                    placeholder={t.playlistName}
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-black/40 text-white placeholder-gray-400 rounded-lg py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    onKeyPress={(e) => e.key === "Enter" && createPlaylist()}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={createPlaylist}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                    >
                      {t.create}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingPlaylist(false);
                        setNewPlaylistName("");
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`group cursor-pointer transition-all duration-300 ${
                      currentPlaylist === playlist.id
                        ? "scale-105"
                        : "hover:scale-102"
                    }`}
                  >
                    <div
                      className={`bg-gradient-to-r from-gray-700 to-gray-600 p-3 rounded-xl shadow-lg relative overflow-hidden border group-hover:from-gray-600 group-hover:to-gray-500 ${
                        currentPlaylist === playlist.id
                          ? "ring-2 ring-white border-white/50"
                          : "border-transparent"
                      }`}
                      onClick={() => selectPlaylist(playlist.id)}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="text-lg drop-shadow-lg">
                            {playlist.id === "favorites" ? "❤️" : "📁"}
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingPlaylistId === playlist.id ? (
                              <input
                                type="text"
                                value={editingPlaylistName}
                                onChange={(e) =>
                                  setEditingPlaylistName(e.target.value)
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    editPlaylistName(
                                      playlist.id,
                                      editingPlaylistName
                                    );
                                  }
                                }}
                                onBlur={() =>
                                  editPlaylistName(
                                    playlist.id,
                                    editingPlaylistName
                                  )
                                }
                                className="bg-black/40 text-white text-sm font-semibold w-full px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <div className="font-semibold text-white drop-shadow-md text-sm truncate">
                                {playlist.name}
                              </div>
                            )}
                            <div className="text-xs text-white/90 drop-shadow-md">
                              {playlist.tracks.length} {t.tracks}
                            </div>
                          </div>
                        </div>
                        {!playlist.isSystem && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPlaylistId(playlist.id);
                                setEditingPlaylistName(playlist.name);
                              }}
                              className="text-gray-300 hover:text-white p-1 rounded transition-colors"
                              title={t.editPlaylist}
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePlaylist(playlist.id);
                              }}
                              className="text-gray-300 hover:text-red-400 p-1 rounded transition-colors"
                              title={t.deletePlaylist}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-orange-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg leading-tight py-1">
              {currentPlaylist
                ? playlists.find((p) => p.id === currentPlaylist)?.name ||
                  t.playlists
                : categories.find((c) => c.id === selectedCategory)?.name ||
                  t.allSounds}
            </h2>
            <div className="hidden md:flex items-center space-x-2 text-gray-300 bg-black/30 px-3 py-2 rounded-lg">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">{t.highQualityAudio}</span>
            </div>
          </div>

          {/* Track List - ヘッダーなし */}
          <div className="space-y-2">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  {currentPlaylist ? (
                    <List className="w-10 h-10 md:w-12 md:h-12" />
                  ) : (
                    <Search className="w-10 h-10 md:w-12 md:h-12" />
                  )}
                </div>
                <div className="text-lg md:text-xl mb-2">
                  {currentPlaylist ? t.noPlaylistTracks : t.noTracks}
                </div>
              </div>
            ) : (
              filteredTracks.map((track, index) => {
                const localizedTrack = getLocalizedTrack(track);
                const isFavorited = favorites.has(track.id);
                return (
                  <div
                    key={track.id}
                    className={`
                      flex items-center
                      py-3 md:py-4 px-3 md:px-4 
                      rounded-xl hover:bg-black/40 cursor-pointer transition-all duration-300 group backdrop-blur-sm border 
                      ${
                        currentTrack?.id === track.id
                          ? "bg-purple-600/30 border-purple-400/50 ring-1 ring-purple-400/50"
                          : "bg-black/20 border-transparent hover:border-gray-600"
                      }
                    `}
                  >
                    {/* Play Button */}
                    <button
                      onClick={() => playTrack(track)}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center hover:from-white/30 hover:to-white/10 transition-all duration-300 flex-shrink-0 mr-3"
                      disabled={isLoading && currentTrack?.id === track.id}
                    >
                      {isLoading && currentTrack?.id === track.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </button>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0 mr-3">
                      <div
                        className={`font-semibold text-sm md:text-base truncate ${
                          currentTrack?.id === track.id
                            ? "text-white"
                            : "text-gray-100"
                        } group-hover:text-white transition-colors`}
                      >
                        {localizedTrack.title}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-gray-600 to-gray-700 px-2 py-1 rounded-full text-xs font-medium text-white">
                          {categories.find((c) => c.id === track.category)
                            ?.name || track.category}
                        </span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="text-xs text-gray-400 font-mono flex-shrink-0 mr-3">
                      {track.duration}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isFavorited
                            ? "text-red-400 hover:text-red-300"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                        title={
                          isFavorited ? t.removeFromFavorites : t.addToFavorites
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorited ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrackForPlaylist(track.id);
                          setShowPlaylistModal(true);
                        }}
                        className="text-gray-400 hover:text-purple-400 p-2 rounded-full transition-colors"
                        title={t.addToPlaylist}
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {currentPlaylist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPlaylist(currentPlaylist, track.id);
                          }}
                          className="text-gray-400 hover:text-red-400 p-2 rounded-full transition-colors"
                          title={t.removeFromPlaylist}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">
                {t.addToPlaylist}
              </h3>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {playlists
                  .filter((p) => p.id !== "favorites")
                  .map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() =>
                        addToPlaylist(playlist.id, selectedTrackForPlaylist)
                      }
                      className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-3"
                    >
                      <List className="w-5 h-5 text-gray-300" />
                      <div>
                        <div className="text-white font-medium">
                          {playlist.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {playlist.tracks.length} {t.tracks}
                        </div>
                      </div>
                    </button>
                  ))}

                <button
                  onClick={() => {
                    setShowPlaylistModal(false);
                    setShowCreatePlaylistModal(true);
                  }}
                  className="w-full text-left p-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <Plus className="w-5 h-5 text-white" />
                  <div className="text-white font-medium">
                    {t.createPlaylist}
                  </div>
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-600">
              <button
                onClick={() => {
                  setShowPlaylistModal(false);
                  setSelectedTrackForPlaylist(null);
                }}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Player */}
      {currentTrack && (
        <div
          className={`fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-600 transition-all duration-300 z-40 ${
            isPlayerMinimized ? "p-3 md:p-2" : "p-4"
          }`}
        >
          {isPlayerMinimized ? (
            /* 最小化状態 */
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  <img
                    src="https://i.imgur.com/rVJyLeP.png"
                    alt="瞑想ロゴ"
                    className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-md"
                    onError={(e) => {
                      if (e.target.src.includes(".png")) {
                        e.target.src = "https://i.imgur.com/rVJyLeP.jpg";
                      } else {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }
                    }}
                  />
                  <Volume2
                    className="w-6 h-6 text-white"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white text-sm md:text-base truncate">
                    {getLocalizedTrack(currentTrack).title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {t.natural}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                <button
                  onClick={toggleRepeat}
                  className={`rounded-full p-2 transition-all duration-300 hover:scale-110 ${
                    isRepeating
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                  title={isRepeating ? t.repeatOn : t.repeatOff}
                >
                  <Repeat className="w-3 h-3 md:w-4 md:h-4" />
                </button>

                <button
                  onClick={skipToPrevious}
                  className="bg-gray-600 hover:bg-gray-500 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                  title={t.previous}
                  disabled={filteredTracks.length <= 1}
                >
                  <SkipBack className="w-3 h-3 md:w-4 md:h-4" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="bg-gradient-to-r from-white to-gray-100 text-black rounded-full p-2 hover:from-gray-100 hover:to-white hover:scale-110 transition-all duration-300 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={skipToNext}
                  className="bg-gray-600 hover:bg-gray-500 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                  title={t.next}
                  disabled={filteredTracks.length <= 1}
                >
                  <SkipForward className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                {/* ハート・プラスボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentTrack.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    favorites.has(currentTrack.id)
                      ? "text-red-400 hover:text-red-300"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                  title={
                    favorites.has(currentTrack.id)
                      ? t.removeFromFavorites
                      : t.addToFavorites
                  }
                >
                  <Heart
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      favorites.has(currentTrack.id) ? "fill-current" : ""
                    }`}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrackForPlaylist(currentTrack.id);
                    setShowPlaylistModal(true);
                  }}
                  className="text-gray-400 hover:text-purple-400 p-2 rounded-full transition-colors"
                  title={t.addToPlaylist}
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                </button>

                <button
                  onClick={() => setIsPlayerMinimized(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300 ml-2"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* 最大化状態 */
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div></div>
                <button
                  onClick={() => setIsPlayerMinimized(true)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Current Track Info */}
                <div className="flex items-center space-x-4 w-full md:w-1/3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-xl overflow-hidden flex-shrink-0">
                    <img
                      src="https://i.imgur.com/rVJyLeP.png"
                      alt="瞑想ロゴ"
                      className="w-8 h-8 md:w-12 md:h-12 object-contain rounded-lg"
                      onError={(e) => {
                        if (e.target.src.includes(".png")) {
                          e.target.src = "https://i.imgur.com/rVJyLeP.jpg";
                        } else {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }
                      }}
                    />
                    <Volume2
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white text-sm md:text-base truncate">
                      {getLocalizedTrack(currentTrack).title}
                    </div>
                    <div className="text-xs md:text-sm text-gray-300 truncate">
                      {getLocalizedTrack(currentTrack).artist}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center space-y-3 w-full md:w-1/3">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                      onClick={toggleRepeat}
                      className={`rounded-full p-2 transition-all duration-300 hover:scale-110 ${
                        isRepeating
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "bg-gray-600/50 text-gray-300 hover:bg-gray-500/50"
                      }`}
                      title={isRepeating ? t.repeatOn : t.repeatOff}
                    >
                      <Repeat className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <button
                      onClick={skipToPrevious}
                      className="bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                      title={t.previous}
                      disabled={filteredTracks.length <= 1}
                    >
                      <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="bg-gradient-to-r from-white to-gray-100 text-black rounded-full p-3 hover:from-gray-100 hover:to-white hover:scale-110 transition-all duration-300 shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : isPlaying ? (
                        <Pause className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <Play className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </button>

                    <button
                      onClick={skipToNext}
                      className="bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                      title={t.next}
                      disabled={filteredTracks.length <= 1}
                    >
                      <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    {/* ハート・プラスボタン */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(currentTrack.id);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        favorites.has(currentTrack.id)
                          ? "text-red-400 hover:text-red-300"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                      title={
                        favorites.has(currentTrack.id)
                          ? t.removeFromFavorites
                          : t.addToFavorites
                      }
                    >
                      <Heart
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          favorites.has(currentTrack.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrackForPlaylist(currentTrack.id);
                        setShowPlaylistModal(true);
                      }}
                      className="text-gray-400 hover:text-purple-400 p-2 rounded-full transition-colors hover:scale-110"
                      title={t.addToPlaylist}
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  {/* Progress Bar - ドラッグ・タッチ対応 */}
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-xs text-gray-400 font-mono">
                      {formatTime(currentTime)}
                    </span>
                    <div
                      ref={progressRef}
                      className="flex-1 bg-white/20 rounded-full h-3 cursor-pointer group relative"
                      onMouseDown={handleProgressStart}
                      onTouchStart={handleProgressStart}
                    >
                      <div
                        className="bg-gradient-to-r from-white to-gray-200 rounded-full h-3 transition-all duration-150 relative group-hover:from-purple-400 group-hover:to-pink-400"
                        style={{
                          width: duration
                            ? `${(currentTime / duration) * 100}%`
                            : "0%",
                        }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-gray-200"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Volume */}
                <div className="hidden md:flex items-center space-x-4 w-1/3 justify-end">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <div
                      className="w-24 bg-white/20 rounded-full h-2 relative group cursor-pointer"
                      ref={volumeRef}
                      onMouseDown={handleVolumeStart}
                      onTouchStart={handleVolumeStart}
                    >
                      <div
                        className="bg-gradient-to-r from-white to-gray-200 rounded-full h-2 transition-all group-hover:from-purple-400 group-hover:to-pink-400 relative"
                        style={{ width: `${volume}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SensoryAudioLibrary;
