import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReelTile } from "./ReelTile";

type Props = {
  video: { youtube: string; poster: string };
  label: string;
  closeLabel: string;
  sizes: string;
  className?: string;
};

export function VideoTile({ video, label, closeLabel, sizes, className }: Props) {
  return (
    <ReelTile
      code={video.youtube}
      provider="youtube"
      label={label}
      closeLabel={closeLabel}
      className={cn(
        "group relative block aspect-[9/16] w-full overflow-hidden rounded-t-full bg-secondary",
        className,
      )}
    >
      <Image
        src={video.poster}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </ReelTile>
  );
}
