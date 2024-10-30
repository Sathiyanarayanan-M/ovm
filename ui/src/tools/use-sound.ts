import { Howl } from "howler";
import React from "react";

const events = ["mousedown", "touchstart"];

function useInteraction() {
  const [ready, setReady] = React.useState(false);

  const listener = () => {
    if (ready === false) {
      setReady(true);
    }
  };

  React.useEffect(() => {
    events.forEach((event) => {
      document.addEventListener(event, listener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener);
      });
    };
  }, []);

  return ready;
}

export function useAudio() {
  const hasInteracted = useInteraction();
  const audioRef = React.useRef<Audios>();

  const playSound = (name: AudioNames) => {
    Object.values(audioRef.current || {}).forEach((val) => {
      val.stop();
    });
    audioRef.current?.[name].play();
  };

  React.useEffect(() => {
    if (!hasInteracted) {
      return;
    }

    // Awkward Silence
    const awk = new Howl({
      src: ["/assets/sounds/awk.ogg"],
    });
    // Emotional Damage
    const ed = new Howl({
      src: ["/assets/sounds/ed.ogg"],
    });
    // WOW
    const ww = new Howl({
      src: ["/assets/sounds/ww.ogg"],
    });
    // Among us
    const amg = new Howl({
      src: ["/assets/sounds/amg.ogg"],
    });
    // YEAH BOI
    const yb = new Howl({
      src: ["/assets/sounds/yb.ogg"],
    });
    // Thambi Yarru
    const ty = new Howl({
      src: ["/assets/sounds/ty.ogg"],
    });
    // Authu Avlotha
    const aa = new Howl({
      src: ["/assets/sounds/aa.ogg"],
    });
    // Moye Moye
    const mm = new Howl({
      src: ["/assets/sounds/mm.ogg"],
    });

    // Robert D wide
    const rd = new Howl({
      src: ["/assets/sounds/rd.ogg"],
    });

    // Sad Drum
    const sd = new Howl({
      src: ["/assets/sounds/sd.ogg"],
    });
    // Game Over
    const gm = new Howl({
      src: ["/assets/sounds/gm.ogg"],
    });
    // Loss
    const tu = new Howl({
      src: ["/assets/sounds/tu.ogg"],
    });
    // Join Room
    const jr = new Howl({
      src: ["/assets/sounds/jr.ogg"],
    });

    const allAudios = {
      awk,
      ed,
      ww,
      amg,
      yb,
      ty,
      aa,
      mm,
      rd,
      sd,
      gm,
      tu,
      jr,
    };

    audioRef.current = allAudios;

    return () => {
      Object.values(allAudios).forEach((val) => {
        val.unload();
      });
    };
  }, [hasInteracted]);

  return playSound;
}

type AudioNames =
  | "awk"
  | "ed"
  | "ww"
  | "amg"
  | "yb"
  | "ty"
  | "aa"
  | "mm"
  | "rd"
  | "sd"
  | "gm"
  | "tu"
  | "jr";
type Audios = Record<AudioNames, Howl>;

export default useAudio;
