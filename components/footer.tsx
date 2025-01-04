import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href="https://github.com/kidyoh"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Kidus Yohannes
          </a>
          .
        </p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/kidyoh"
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-muted-foreground hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/kidus-yohannes-568a31207/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-muted-foreground hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
} 