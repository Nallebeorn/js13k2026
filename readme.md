# Unifrost

A tiny browser game made for [js13kGames 2016](https://js13kgames.com/2026/).

## Building

Yes, I'm a web developer, of course my 13KB game has a 100MB node_modules!

### Installing development dependencies

I use pnpm to manage both packages and the Node runtime. If you have a recent
version of pnpm, simply run `pnpm install` to install everything.

If you prefer it, regular `npm install` should work fine too, but you'll get an
error if you don't have the exact version of node pinned in package.json.
Install it yourself, or delete `devEngines` from package.json if you can't be
bothered :)

### Build distribution
* `pnpm run build-once` creates dist.zip. That's the game!
* The build script expects `advzip` to exist on the path. If you're on Linux,
  chances are you can install it with your system package manager, probably as
  `advancecomp", and it's also in Homebrew on macOS for example. On Windows, you
  can download it from their [website](https://www.advancemame.it/download).

### Development with watch mode

You nead to run at least `pnpm run dev` and `pnpm run bindata` to build
everything. The game will rebuild automatically on changes, and run a Vite
development server.

You can also run `pnpm run build` to build the final distribution in watch mode.
It'll even print the current zip size on every change!

See package.json for other scripts (tests etc.).
