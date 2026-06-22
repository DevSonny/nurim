'use client'
import dynamic from 'next/dynamic'

const MoleculeScene = dynamic(() => import('./MoleculeScene'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(232,232,245,0.28)',
        fontSize: '12px',
        fontFamily: 'system-ui',
        letterSpacing: '0.5px',
      }}
    >
      분자 로딩 중…
    </div>
  ),
})

export default MoleculeScene
