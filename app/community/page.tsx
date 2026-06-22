'use client'
import { useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/ui/BottomNav'
import { colors } from '@/lib/tokens'

interface FeedItem {
  id: string
  user: string
  avatar: string
  orbit: string
  orbitColor: string
  content: string
  value: string
  valueUnit: string
  streak: number
  likes: number
  time: string
  liked: boolean
}

const MOCK_FEED: FeedItem[] = [
  { id: '1', user: '민준', avatar: 'MJ', orbit: '공부', orbitColor: '#c040ff',
    content: '영어 회화 수업 첫날. 생각보다 많이 말했다.', value: '60', valueUnit: '분',
    streak: 21, likes: 14, time: '3분 전', liked: false },
  { id: '2', user: '서연', avatar: 'SY', orbit: '운동', orbitColor: '#44ff88',
    content: '5km 러닝. 비가 와서 더 상쾌했음', value: '5', valueUnit: 'km',
    streak: 9, likes: 31, time: '18분 전', liked: true },
  { id: '3', user: '지호', avatar: 'JH', orbit: '재테크', orbitColor: '#ffb830',
    content: 'S&P 500 적립식 추가 매수. 꾸준함이 답이다', value: '100,000', valueUnit: '원',
    streak: 45, likes: 8, time: '1시간 전', liked: false },
  { id: '4', user: '나', avatar: '나', orbit: '학습', orbitColor: '#c040ff',
    content: 'Next.js 15 App Router 공부. 드디어 이해됨', value: '9', valueUnit: '점',
    streak: 14, likes: 5, time: '2시간 전', liked: false },
  { id: '5', user: '하린', avatar: 'HR', orbit: '건강', orbitColor: '#ff4466',
    content: '명상 20분 + 스트레칭. 요즘 이게 최고', value: '✓', valueUnit: '완료',
    streak: 30, likes: 22, time: '3시간 전', liked: true },
  { id: '6', user: '찬우', avatar: 'CW', orbit: '관계', orbitColor: '#4488ff',
    content: '오랜 친구랑 밥. 좋은 사람들을 자주 만나야지', value: '✓', valueUnit: '완료',
    streak: 7, likes: 17, time: '5시간 전', liked: false },
]

export default function CommunityPage() {
  const [feed, setFeed] = useState(MOCK_FEED)
  const [tab, setTab] = useState<'팔로잉' | '전체'>('팔로잉')

  const toggleLike = (id: string) => {
    setFeed(f => f.map(item =>
      item.id === id
        ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
        : item
    ))
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: colors.ground,
        color: colors.text,
        overflowY: 'auto',
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '52px 24px 0',
          position: 'sticky',
          top: 0,
          background: `${colors.ground}ee`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 20,
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>피드</h1>
          <Link
            href="/share"
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              background: `${colors.core}18`,
              border: `1px solid ${colors.core}44`,
              color: colors.core,
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.2px',
            }}
          >
            공유 +
          </Link>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0' }}>
          {(['팔로잉', '전체'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === t ? colors.core : 'transparent'}`,
                color: tab === t ? colors.core : `${colors.text}44`,
                fontSize: '13px',
                fontWeight: tab === t ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <div style={{ padding: '12px 16px 0' }}>
        {feed.map(item => (
          <FeedCard key={item.id} item={item} onLike={() => toggleLike(item.id)} />
        ))}
      </div>

      <BottomNav />
    </main>
  )
}

function FeedCard({ item, onLike }: { item: FeedItem; onLike: () => void }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '10px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `${item.orbitColor}22`,
            border: `1.5px solid ${item.orbitColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: item.orbitColor,
            flexShrink: 0,
          }}
        >
          {item.avatar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>{item.user}</span>
            <span
              style={{
                fontSize: '10px',
                padding: '1px 7px',
                borderRadius: '8px',
                background: `${item.orbitColor}18`,
                color: item.orbitColor,
                fontWeight: 600,
              }}
            >
              {item.orbit}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: `${colors.text}33`,
                marginLeft: 'auto',
              }}
            >
              🔥 {item.streak}일
            </span>
          </div>
          <div style={{ fontSize: '10px', color: `${colors.text}33`, marginTop: '1px' }}>
            {item.time}
          </div>
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: '13px', lineHeight: 1.6, color: `${colors.text}cc`, marginBottom: '10px' }}>
        {item.content}
      </p>

      {/* Value badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '3px',
            background: `${item.orbitColor}14`,
            border: `1px solid ${item.orbitColor}33`,
            borderRadius: '10px',
            padding: '4px 10px',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 800, color: item.orbitColor }}>
            {item.value}
          </span>
          <span style={{ fontSize: '10px', color: `${item.orbitColor}88` }}>
            {item.valueUnit}
          </span>
        </div>

        {/* Like */}
        <button
          onClick={onLike}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: item.liked ? '#ff4466' : `${colors.text}44`,
            fontSize: '12px',
            fontFamily: 'inherit',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: '16px' }}>{item.liked ? '♥' : '♡'}</span>
          <span style={{ fontWeight: item.liked ? 700 : 400 }}>{item.likes}</span>
        </button>
      </div>
    </div>
  )
}
