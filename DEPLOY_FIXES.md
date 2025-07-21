# Quick Deployment Fixes

## Fix 1: Update dashboard/page.tsx

Replace all `<img>` tags with Next.js `<Image>` component:

```typescript
// Add this import at the top
import Image from 'next/image';

// Replace the img tags around lines 157, 284, 312 with:
<Image
  src={artist.images[0].url}
  alt={artist.name}
  width={96}
  height={96}
  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
/>

<Image
  src={user.images[0].url}
  alt={user.display_name}
  width={80}
  height={80}
  className="w-20 h-20 rounded-full"
/>

<Image
  src={track.album.images[0].url}
  alt={track.album.name}
  width={48}
  height={48}
  className="w-12 h-12 rounded ml-4 mr-4 object-cover"
/>
```

## Fix 2: Remove unused auth.ts

Since we're not using the AuthProvider context, delete or comment out the auth.ts file for now.

## Quick Alternative: Suppress warnings

Add this to next.config.js:
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['i.scdn.co'],
  },
}
```