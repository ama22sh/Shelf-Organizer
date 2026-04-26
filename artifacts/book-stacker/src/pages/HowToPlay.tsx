import { Link } from "wouter";
import { ArrowLeft, MousePointer2, RotateCw, Feather, Anchor, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToPlay() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-home">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Button>
        </Link>
        <h1 className="font-serif text-3xl text-primary">How to Play</h1>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none font-serif space-y-6">
        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-xl flex items-center gap-2 mt-0 mb-3 text-primary">
            <MousePointer2 className="w-5 h-5" />
            The Basics
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Each level gives you a stack of books and one or more shelves. Click a
            book in the tray to pick it up, then click an empty cell on a shelf to
            set it down. Books cannot overlap each other or covered cells.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Click a placed book to lift it again. The level is complete when every
            book has found a home.
          </p>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-xl flex items-center gap-2 mt-0 mb-3 text-primary">
            <RotateCw className="w-5 h-5" />
            Rotation
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Some books may be turned on their side. When holding a rotatable book,
            press the rotate button or the <kbd className="px-1.5 py-0.5 rounded border bg-muted text-sm">R</kbd> key
            to swap its width and height.
          </p>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-xl flex items-center gap-2 mt-0 mb-3 text-primary">
            Special Books
          </h2>
          <ul className="space-y-2 list-none pl-0">
            <li className="flex items-start gap-3">
              <Feather className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <span>
                <strong>Fragile</strong> — must always rest on the bottom row of a
                shelf, never stacked above another book.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Anchor className="w-5 h-5 text-stone-500 mt-0.5 shrink-0" />
              <span>
                <strong>Heavy</strong> — cannot be placed on top of fragile books.
                Place them low and steady.
              </span>
            </li>
          </ul>
        </section>

        <section className="bg-card border border-border rounded-md p-5">
          <h2 className="font-serif text-xl flex items-center gap-2 mt-0 mb-3 text-primary">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            Stars
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Earn up to three stars per level by finishing in the fewest moves and
            the shortest time. Some levels add a time or move limit — keep an eye
            on the meters.
          </p>
        </section>
      </div>
    </div>
  );
}
