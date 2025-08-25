import path from 'node:path';
import { getProfileFromUsernameCache } from '@/server/cache/user';
import type { NextRequest } from 'next/server';
import { Column, Font, Photo, type SoneImage, Span, Text, TextDefault, sone } from 'sone';

const resolveDataPath = (p: string) => path.join(process.cwd(), 'src/app/og/_data', p);

const resolvePublicPath = (p: string) => path.join(process.cwd(), 'public', p);

const ASSETS_CACHE = new Map<string | Uint8Array, SoneImage>();

Font.load('KantumruyPro', resolveDataPath('KantumruyPro.ttf'));
Font.load('Geist Mono', resolveDataPath('GeistMono.ttf'));
Font.load('Inter', resolveDataPath('Inter.ttf'));

type KhmerCoderAccountProps = {
  photoUrl?: string | null;
  name?: string;
  bio?: string | null;
  position?: string | null;
  username?: string | null;
  followingCount: number;
  follwersCount: number;
};

function KhmerCoderAccount({
  photoUrl,
  name,
  bio,
  position,
  username,
  followingCount,
  follwersCount,
}: KhmerCoderAccountProps) {
  const colors = {
    primary: '#ffcc01',
    bg: 'white',
    text: '#737373',
    border: '#fb923b',
    slate: '#eee',
  };

  return Column(
    TextDefault(
      //
      photoUrl != null
        ? Photo(photoUrl)
            .size(172)
            .preserveAspectRatio()
            .rounded(32)
            .borderColor(colors.border)
            .borderWidth(8)
            .cornerSmoothing(0.6)
        : Column()
            .size(172)
            .rounded(32)
            .bg(colors.slate)
            .borderColor('transparent')
            .borderWidth(8)
            .cornerSmoothing(0.6),
      Text(
        name,
        username != null
          ? Span(` ${username}`).weight(500).size(32).color(colors.text).font('Geist Mono')
          : null
      )
        .size(44)
        .weight(600)
        .marginTop(14),
      Text(position).size(26).weight(500).color(colors.text),
      Text(
        Span(String(follwersCount)).color('black').weight('bold'),
        Span(' Followers').color(colors.text),
        '  ',
        Span(String(followingCount)).color('black').weight('bold'),
        Span(' Following').color(colors.text)
      ).size(22),
      bio != null
        ? Text(bio)
            .size(26)
            .weight(500)
            .bg('#f2f2f2')
            .padding(12, 20)
            .rounded(16)
            .color('rgba(60, 60, 60, 1)')
            .cornerSmoothing(0.6)
            .marginTop(4)
        : null
    ).font('Inter', 'KantumruyPro'),
    //
    Column().bg(colors.primary).height(32).position('absolute').bottom(0).left(0).right(0),
    //
    Photo(resolvePublicPath('logo.svg'))
      .position('absolute')
      .width(140)
      .right(72)
      .top(72)
      .preserveAspectRatio(),

    Column().width(2).position('absolute').top(0).bottom(32).bg('#eee').left(44),
    Column().height(2).position('absolute').left(0).right(0).top(44).bg('#eee'),
    Column().width(2).position('absolute').top(0).bottom(32).bg('#eee').right(44)
  )
    .size(1200, 630)
    .bg(colors.bg)
    .padding(72)
    .gap(8);
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.pathname.split('/').pop();
  const profile = await getProfileFromUsernameCache(encodeURIComponent(`@${username}`));

  if (profile == null) {
    return;
  }

  const root = KhmerCoderAccount({
    photoUrl: profile.user.image,
    name: profile.user.name,
    position: profile.member_profile.title,
    username: `@${profile.member_profile.alias}`,
    bio: profile.member_profile.bio,
    followingCount: profile.user.followingCount ?? 0,
    follwersCount: profile.user.followersCount ?? 0,
  });

  const buffer = await sone(root, { cache: ASSETS_CACHE }).jpg(0.95);
  return new Response(Buffer.from(buffer), {
    headers: { 'content-type': 'image/jpeg' },
  });
}
