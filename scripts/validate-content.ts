import { loadLocalContentPack } from './local-pack'

const pack = loadLocalContentPack()

console.log('\nContent pack validation passed.\n')
console.log(`Pack: ${pack.id}`)
console.log(`Artist: ${pack.artist.displayName}`)
console.log(`Dimensions: ${pack.dimensions.length}`)
console.log(`Questions: ${pack.questions.length}`)
console.log(`Tracks: ${pack.tracks.length}`)
console.log(`Canonical platform: ${pack.rankingDecision.canonicalPlatform}`)
console.log(`Snapshot date: ${pack.rankingDecision.snapshotDate}`)
console.log('\nTracks:')
pack.tracks.forEach((track) => {
  console.log(`  ${String(track.evidence.canonicalRanking.rank).padStart(2, '0')}. ${track.title}`)
})
console.log()
