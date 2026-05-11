import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// ── Static post data ──────────────────────────────────────────
const POSTS = [
  {
    id: "1",
    name: "Rahul Sharma",
    badge: "1st",
    title: "Software Engineer | Google | Ex-Amazon",
    time: "2d",
    content:
      "Thrilled to announce that I've joined Google as a Software Engineer! 🎉 It's been an incredible journey and I'm grateful for all the support from my alumni network...",
    likes: 142,
    comments: 38,
    avatar: "RS",
    avatarBg: "#4285F4",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "2",
    name: "Priya Mehta",
    badge: "2nd",
    title: "Product Manager | Flipkart",
    time: "1d",
    content:
      "🚀 Hiring Alert! Our team at Flipkart is looking for talented Product Managers. If you're passionate about e-commerce and want to make an impact, drop me a DM!",
    likes: 89,
    comments: 52,
    avatar: "PM",
    avatarBg: "#F7971E",
    hasImage: true,
    imageColor: "#FF6B35",
    imageBadge: "WE'RE HIRING!",
  },
  {
    id: "3",
    name: "Arjun Kapoor",
    badge: "1st",
    title: "Data Scientist | Microsoft | IIT Delhi Alumni",
    time: "3d",
    content:
      "Just completed my first year at Microsoft! 🎊 The learning curve has been steep but incredibly rewarding. Here's a quick reflection on what I've learned so far...",
    likes: 210,
    comments: 45,
    avatar: "AK",
    avatarBg: "#00A4EF",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "4",
    name: "Sneha Verma",
    badge: "1st",
    title: "UI/UX Designer | Zomato | Design Enthusiast",
    time: "5h",
    content:
      "Excited to share my latest design case study on reimagining the food delivery experience! 🍕 Check out how we improved conversion by 40% through better UX...",
    likes: 327,
    comments: 67,
    avatar: "SV",
    avatarBg: "#E23744",
    hasImage: true,
    imageColor: "#E23744",
    imageBadge: "CASE STUDY",
  },
  {
    id: "5",
    name: "Vikram Singh",
    badge: "2nd",
    title: "Backend Engineer | Razorpay | FinTech",
    time: "1w",
    content:
      "Proud to share that I've been promoted to Senior Engineer at Razorpay! 💪 Grateful to my mentors and the alumni community that guided me through this journey...",
    likes: 456,
    comments: 89,
    avatar: "VS",
    avatarBg: "#3395FF",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "6",
    name: "Ananya Gupta",
    badge: "1st",
    title: "ML Engineer | Anthropic | Ex-OpenAI",
    time: "2d",
    content:
      "🤖 Just published my research paper on efficient transformer architectures! It's been months of hard work and I'm so happy it's finally out. Link in comments...",
    likes: 589,
    comments: 103,
    avatar: "AG",
    avatarBg: "#6C63FF",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "7",
    name: "Rohit Bansal",
    badge: "3rd",
    title: "(HR) Talent Acquisition | Infosys",
    time: "6h",
    content:
      "💼 We're hiring Flutter Developers, React Native Engineers & Node.js Developers for our Bangalore office. Freshers & experienced both welcome. Apply now!",
    likes: 73,
    comments: 241,
    avatar: "RB",
    avatarBg: "#007CC2",
    hasImage: true,
    imageColor: "#C0392B",
    imageBadge: "JOIN OUR TEAM",
  },
  {
    id: "8",
    name: "Kavya Nair",
    badge: "1st",
    title: "Full Stack Developer | Swiggy | NITK Batch '21",
    time: "3d",
    content:
      "Starting my new role at Swiggy today! 🛵 So excited to work on problems at scale. Here's a photo of my welcome kit — the team is absolutely amazing!",
    likes: 198,
    comments: 44,
    avatar: "KN",
    avatarBg: "#FC8019",
    hasImage: true,
    imageColor: "#FC8019",
    imageBadge: "WELCOME KIT 🎁",
  },
  {
    id: "9",
    name: "Aditya Joshi",
    badge: "2nd",
    title: "DevOps Engineer | PhonePe | Cloud & K8s",
    time: "4d",
    content:
      "Just cleared my AWS Solutions Architect Professional certification! ☁️ If anyone needs tips on how to prepare, feel free to reach out. Happy to help fellow alumni!",
    likes: 264,
    comments: 57,
    avatar: "AJ",
    avatarBg: "#FF9900",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "10",
    name: "Meera Pillai",
    badge: "1st",
    title: "Startup Founder | EdTech | Forbes 30U30",
    time: "1d",
    content:
      "🎓 Our EdTech startup just crossed 1 LAKH students! When I started this 2 years ago, I had no idea it would grow this fast. Thank you to everyone who believed in us early on...",
    likes: 1203,
    comments: 187,
    avatar: "MP",
    avatarBg: "#27AE60",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "11",
    name: "Suresh Rao",
    badge: "2nd",
    title: "SDE-2 | Paytm | Competitive Programmer",
    time: "2w",
    content:
      "After 6 months of consistent practice on LeetCode, I finally cracked Paytm's interview! 💻 Here's my preparation strategy that helped me land the offer...",
    likes: 892,
    comments: 215,
    avatar: "SR",
    avatarBg: "#002970",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "12",
    name: "Pooja Iyer",
    badge: "1st",
    title: "Business Analyst | Deloitte | MBA IIM-A",
    time: "5d",
    content:
      "Incredible experience at the Alumni Reunion last weekend! 🏫 Met so many batchmates after years. The college has changed so much but the warmth remains the same...",
    likes: 445,
    comments: 98,
    avatar: "PI",
    avatarBg: "#86BC25",
    hasImage: true,
    imageColor: "#2C3E7A",
    imageBadge: "REUNION '25 📸",
  },
  {
    id: "13",
    name: "Nikhil Choudhary",
    badge: "1st",
    title: "iOS Developer | Apple | Ex-Infosys",
    time: "1d",
    content:
      "🍎 Day one at Apple's Cupertino campus done! I still can't believe this is real. To all juniors — keep working hard, your dream company is possible. My DMs are open!",
    likes: 2341,
    comments: 312,
    avatar: "NC",
    avatarBg: "#555555",
    hasImage: false,
    imageColor: null,
  },
  {
    id: "14",
    name: "Deepika Sinha",
    badge: "2nd",
    title: "(HR) Campus Recruiter | TCS | Hiring Now",
    time: "8h",
    content:
      "📢 TCS is conducting a campus drive for 2025 passouts! Roles in Java, Python, Data Analytics & Cloud. Registration closes this Friday. Share with your juniors!",
    likes: 156,
    comments: 423,
    avatar: "DS",
    avatarBg: "#3A7BD5",
    hasImage: true,
    imageColor: "#3A7BD5",
    imageBadge: "CAMPUS DRIVE 🎓",
  },
  {
    id: "15",
    name: "Karan Malhotra",
    badge: "1st",
    title: "Research Engineer | Meta AI | NLP",
    time: "3d",
    content:
      "Honoured to be featured in MIT Technology Review's 35 Innovators Under 35 list! 🏆 This wouldn't have been possible without the strong foundation our college gave me...",
    likes: 3867,
    comments: 541,
    avatar: "KM",
    avatarBg: "#1877F2",
    hasImage: false,
    imageColor: null,
  },
];

// ── Single Card ───────────────────────────────────────────────
function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  return (
    <View style={styles.card}>
      {/* ── Card Header ── */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: post.avatarBg }]}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{post.name}</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{post.badge}</Text>
            </View>
          </View>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {post.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{post.time} · Edited · </Text>
            <Icon name="globe-outline" size={12} color="#888" />
          </View>
        </View>

        <TouchableOpacity style={styles.moreBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="ellipsis-horizontal" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* ── Post Content ── */}
      <Text style={styles.postContent} numberOfLines={3}>
        {post.content}
        {"  "}
        <Text style={styles.moreText}>more</Text>
      </Text>

      {/* ── Post Image placeholder (if has image) ── */}
      {post.hasImage && (
        <View style={[styles.postImage, { backgroundColor: post.imageColor }]}>
          <Text style={styles.imageBadgeText}>{post.imageBadge}</Text>
        </View>
      )}

      {/* ── Reactions summary ── */}
      <View style={styles.reactionRow}>
        <View style={styles.reactionIcons}>
          <View style={[styles.reactionBubble, { backgroundColor: "#1877F2" }]}>
            <Text style={styles.reactionEmoji}>👍</Text>
          </View>
          <View style={[styles.reactionBubble, { backgroundColor: "#E53935", marginLeft: -5 }]}>
            <Text style={styles.reactionEmoji}>❤️</Text>
          </View>
        </View>
        <Text style={styles.reactionCount}>
          {likeCount.toLocaleString()}
        </Text>
        <Text style={styles.commentCount}>{post.comments} comments</Text>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Action Row ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Icon
            name={liked ? "thumbs-up" : "thumbs-up-outline"}
            size={20}
            color={liked ? "#1a2a6c" : "#555"}
          />
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="chatbubble-outline" size={20} color="#555" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="repeat-outline" size={20} color="#555" />
          <Text style={styles.actionText}>Repost</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="paper-plane-outline" size={20} color="#555" />
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Feed List ─────────────────────────────────────────────────
export default function HomeCards() {
  return (
    <>
      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingTop: 14,
  },

  // Header
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 15, fontWeight: "700", color: "#000" },
  badgePill: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, color: "#1a2a6c", fontWeight: "600" },
  jobTitle: { fontSize: 12, color: "#555", marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  time: { fontSize: 11, color: "#888" },
  moreBtn: { padding: 4 },

  // Content
  postContent: {
    fontSize: 14,
    color: "#1a1a1a",
    lineHeight: 20,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  moreText: { color: "#555", fontWeight: "600" },

  // Image
  postImage: {
    height: 180,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBadgeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Reactions
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  reactionIcons: { flexDirection: "row", marginRight: 6 },
  reactionBubble: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  reactionEmoji: { fontSize: 9 },
  reactionCount: { fontSize: 13, color: "#555", flex: 1 },
  commentCount: { fontSize: 13, color: "#555" },

  // Actions
  divider: { height: 1, backgroundColor: "#f0f0f0", marginHorizontal: 14 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  actionText: { fontSize: 13, color: "#555", fontWeight: "500" },
  actionTextActive: { color: "#1a2a6c", fontWeight: "700" },
});