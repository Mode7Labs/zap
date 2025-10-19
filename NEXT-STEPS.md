** Task **

Redesign the entire documentation from the ground up. To begin, let's back up the entire documentation structure found under /docs to /docs-deprectated

Then let's create a fresh /web folder and copy over /index.html. Then let's remove any dead links, but keep the text elements (just nowhere to link them to). Then let's copy over the /assets folder from the backup to /web/assets. Then let's create a folder called /docs and create some structure. We can use the old documentation.html for inspiration for the layout.

Then what we need to do is come up with a structure for the documentation. This documentation needs to be displayed in the docs page, but ALSO read by an LLM. What I suggest, is that we adopt a Markdown format that contains regular Markdown syntax, but also includes some custom blocks. These are:

1. Code Snippet
2. Interactive Demo

A code snippet is an explanatory code snippet, it can just be a simple example to show users how to do something. An interactive demo needs to be fully runnable in a CodeMirror instance. So it needs to include imports from https://esm.sh/@mode-7/zap@0.1.2. We need to be able to configure the latest version of Zap on esm.sh somewhere, so open to ideas on where we can put this import string https://esm.sh/@mode-7/zap@0.1.2 as if the version changes, we don't want to have to parse and change it everywhere every time. The interactive demo needs to allow the user to easily flip between looking at the demo (how it runs) and the code (how it is coded).

Not every page will need code snippets or interactive demos, but most probably will.

We also need to be mindful that this Markdown will need to clearly explain to an LLM how a particular function works.

We then need to start rebuilding the documentation from scratch, reviewing the core Zap engine in /src and ensuring that we are SHOWCASING the absolute simplest possible way to get lots from Zap. We should write lots of simple example snippets, and interactive demos when it makes sense. Code snippets should be the core focus, interactive demos should be used to demonstrate a group of functionality, often as a tiny game or something. Demos should also be easy to restart / reload.

Let's begin with the "Getting Started" section and "Core Concepts" first. Let's get that right, then move onto the rest.

** Visual Elements **

I feel there is unnecessary overlap between a Sprite and an AnimatedSprite in the Zap engine. Whether it's a plain shape, an image, or an animated image, it should still be a Sprite.

Example:

const hero = new AnimatedSprite({
x: 200,
y: 180,
width: 72,
height: 72,
image: someSpriteSheet,
frameWidth: 64,
frameHeight: 64,
animations: {
idle: { frames: [0, 1, 2, 3], fps: 6, loop: true },
jump: { frames: [4, 5, 6, 7], fps: 14, loop: false }
},
interactive: true
});

const pixelHero = new Sprite({
x: 140,
y: 160,
width: 160,
height: 160,
image: someImage
});

Could be solved by adding

animations: {
frameWidth: 64,
frameHeight: 64,
idle: { frames: [0, 1, 2, 3], fps: 6, loop: true },
jump: { frames: [4, 5, 6, 7], fps: 14, loop: false }
}

To the Sprite constructor itself, which if valid, consumes the image as an animated sprite. By taking this approach, we could keep the API simple, and remove the overlap and remove the AnimatedSprite class and the complexity it brings.

What i'm getting at, is merging the animation functionality over into the Sprite class.

We should also review the old backed up docs for the visual elements, and work through in this order:

- Shapes
- Sprites
- Sprite Animation
- Text (which should include Google Fonts)

\*\* UI Components
