'use client';
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { socialLinks } from "@/lib/social-links";
import { SocialIcon } from "@/components/social-icon";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { otherSocialLinks } from "@/lib/social-links";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Music, Loader2, Languages, RefreshCw, Copy, Gift, Clapperboard, Utensils, BookOpen, MicVocal, ChevronsLeftRight } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanyard } from "@/hooks/use-lanyard";
import { Badge } from "@/components/ui/badge";
import { SettingsIcon } from "@/components/icons";
import { translateText } from "@/ai/flows/translate-flow";
import { useGithubActivity } from "@/hooks/use-github-activity";

const defaultAvatar = PlaceHolderImages.find(p => p.id === "avatar-default");
const altAvatar = PlaceHolderImages.find(p => p.id === "avatar-alt");
const carouselImages = PlaceHolderImages.filter(p => p.id.startsWith("carousel-"));

const DISCORD_IDS = ["1221816622046515262", "1443031335563431968"];
const MAIN_DISCORD_ID = DISCORD_IDS[0];
const ALT_DISCORD_ID = DISCORD_IDS[1];
const GITHUB_USERNAME = "Hotaro26";

type TooltipSide = "top" | "bottom" | "left" | "right";

const originalAboutMe = {
  p1: "I'm a passionate developer and a wannabe animator, artist - yeah got a lot of hobbies; but i wanna learn it all~ I like spending time in nature, alone doing my usual things...yeah im a bit antisocial. But i'd love to make friends so feel free to reach out to me ⸜(｡˃ ᵕ ˂ )⸝♡",
  p2: "This page is my little corner of the internet. Feel free to connect with me on any of my social platforms!"
};

const otherLanguages = [
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Indonesian', label: 'Indonesian' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'Vietnamese', label: 'Vietnamese' },
];

type Flower = {
  id: number;
  x: number;
  y: number;
  emoji: string;
};

const flowerEmojis = ['🌸', '💮', '🏵️', '🌹', '🌺', '🌻', '🌼', '🌷'];

export default function Home() {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSurpriseExpanded, setIsSurpriseExpanded] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const { theme, setTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const { data: lanyardData } = useLanyard({ userId: DISCORD_IDS });
  const { lastCommitMessage } = useGithubActivity(GITHUB_USERNAME);
  const [tooltipSide, setTooltipSide] = useState<TooltipSide>("left");

  const [name, setName] = useState("Aki");
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [aboutMe, setAboutMe] = useState(originalAboutMe);
  const [translationsCache, setTranslationsCache] = useState<Record<string, { p1: string, p2: string }>>({ 'English': originalAboutMe });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslateDialogOpen, setIsTranslateDialogOpen] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState('');

  const [currentAvatarId, setCurrentAvatarId] = useState("avatar-default");
  
  const [flowers, setFlowers] = useState<Flower[]>([]);

  const mainLanyard = lanyardData ? lanyardData[MAIN_DISCORD_ID] : null;
  const altLanyard = lanyardData ? lanyardData[ALT_DISCORD_ID] : null;
  const spotifyLanyard = mainLanyard?.listening_to_spotify ? mainLanyard : (altLanyard?.listening_to_spotify ? altLanyard : null);

  const mainStatus = mainLanyard?.discord_status;
  const altStatus = altLanyard?.discord_status;
  const isAccountOnline = (status: string | undefined) => status === 'online' || status === 'idle' || status === 'dnd';
  const isAnyAccountOnline = isAccountOnline(mainStatus) || isAccountOnline(altStatus);

  const currentAvatar = PlaceHolderImages.find(p => p.id === currentAvatarId);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!animationsEnabled) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFlowers: Flower[] = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      x: x,
      y: y,
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
    }));

    setFlowers(prev => [...prev, ...newFlowers]);

    setTimeout(() => {
      setFlowers(currentFlowers =>
        currentFlowers.filter(f => !newFlowers.some(nf => nf.id === f.id))
      );
    }, 2000);
  };

  useEffect(() => {
    const sides: TooltipSide[] = ["top", "bottom", "left", "right"];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    setTooltipSide(randomSide);

    const getIndianTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setCurrentTime(formatter.format(new Date()));
    };

    getIndianTime();
    const intervalId = setInterval(getIndianTime, 60000); // Update every minute

    return () => {
      clearInterval(intervalId);
    }
  }, []);
  
  const handleTranslate = async (language: string) => {
    if (!language) return;

    if (language === 'English') {
      setAboutMe(originalAboutMe);
      setCurrentLanguage('English');
      setIsTranslateDialogOpen(false);
      return;
    }
    
    if (translationsCache[language]) {
      setAboutMe(translationsCache[language]);
      setCurrentLanguage(language);
      setIsTranslateDialogOpen(false);
      return;
    }

    setIsTranslating(true);
    try {
      const [p1, p2] = await Promise.all([
        translateText({ text: originalAboutMe.p1, targetLanguage: language }),
        translateText({ text: originalAboutMe.p2, targetLanguage: language }),
      ]);
      
      const newTranslation = { p1: p1.translation, p2: p2.translation };
      setTranslationsCache(prev => ({ ...prev, [language]: newTranslation }));
      setAboutMe(newTranslation);
      setCurrentLanguage(language);

    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: `Could not translate the text to ${language}. Please try again later.`,
      });
    } finally {
      setIsTranslating(false);
      setIsTranslateDialogOpen(false);
      setOtherLanguage('');
    }
  };


  const handleOtherLinkClick = (platform: string, url: string) => {
    if (platform === 'instagram') {
      toast({
        title: "oi.hotaro",
        description: "I dont use it much tho, mostly its disabled.",
      });
      return;
    }
    if (platform === 'twitter') {
      toast({
        title: "Twitter? Nope.",
        description: "I'm too busy for that kind of drama. Find me elsewhere!",
      });
      return;
    }
    if (platform === 'portfolio') {
        window.open(url, '_blank');
        return;
    }
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${platform} Username Copied!`,
      description: `"${text}" has been copied to your clipboard.`,
    });
  };
  
  const getContainerWidth = () => {
    let width = 28;
    if (isExpanded) {
      width += 22;
    }
    if (isSurpriseExpanded) {
      width += 22;
    }
    return `${width}rem`;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      {flowers.map(flower => (
        <span
          key={flower.id}
          className="pointer-events-none absolute text-2xl animate-flower-burst"
          style={{
            left: flower.x,
            top: flower.y,
            transform: `translate(-50%, -50%) translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px)`,
          }}
        >
          {flower.emoji}
        </span>
      ))}
      <div className="absolute top-4 right-4 z-20">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="transition-all duration-300 hover:bg-transparent hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary))] rounded-full">
              <SettingsIcon className="h-6 w-6" />
              <span className="sr-only">Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">Settings</h4>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="animations">Funny Hovers</Label>
                  <Switch
                    id="animations"
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative z-10 flex transition-all duration-500 ease-in-out" style={{ maxWidth: getContainerWidth() }}>
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 animate-wavy-in z-10 transition-all duration-500 ease-in-out dark:border-primary/10 rounded-lg md:rounded-r-none border-r-0 md:border-r">
          <CardHeader className="flex flex-col items-center gap-4 text-center p-6 sm:p-8">
            <div className="relative group">
              <Avatar 
                className={cn("relative h-24 w-24 border-4 border-neutral-700 transition-transform duration-300 cursor-pointer", animationsEnabled && "group-hover:scale-110")}
                onClick={() => setCurrentAvatarId(currentAvatarId === "avatar-default" ? "avatar-alt" : "avatar-default")}
              >
              {currentAvatar && (
                <Image
                  src={currentAvatar.imageUrl}
                  alt={currentAvatar.description}
                  width={96}
                  height={96}
                  className="rounded-full"
                  data-ai-hint={currentAvatar.imageHint}
                  priority
                />
              )}
              <AvatarFallback>LS</AvatarFallback>
            </Avatar>
            </div>

            <div className="mt-2 text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setName(name === 'Aki' ? 'hotaro' : 'Aki')}
                  >
                    <h1 className="text-3xl text-foreground font-handwriting transition-all duration-300">
                      {name}
                    </h1>
                  </TooltipTrigger>
                  <TooltipContent side={tooltipSide}>
                    <p>
                      <span className="text-muted-foreground">aka </span> 
                      <span>{name === 'Aki' ? 'hotaro' : 'Aki'}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-muted-foreground mt-1 font-description">
                artist, developer, and music enthusiast.
              </p>
              {lanyardData && (
                <Badge variant="secondary" className="mt-4">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className={cn("w-2 h-2 rounded-full", getStatusColor(mainStatus))}></span>
                    <span className={cn("w-2 h-2 rounded-full", getStatusColor(altStatus))}></span>
                  </div>
                  {isAnyAccountOnline ? 'Active' : 'Offline'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 flex flex-col h-[calc(100%-10rem)]">
            <div className="flex-grow">
              <div className="flex flex-col gap-3">
              <TooltipProvider>
                {socialLinks.map((link) => {
                  if (link.platform === 'github') {
                    return (
                      <Tooltip key={link.platform} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            className={cn("w-full justify-start h-auto min-h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                            asChild
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <SocialIcon platform={link.platform} className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                              <div className="flex flex-col items-start">
                                <span className={cn("transition-colors", animationsEnabled && "group-hover:text-primary")}>{link.text}</span>
                                {lastCommitMessage && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></span>
                                    <span className="truncate max-w-[150px] sm:max-w-[200px]">{lastCommitMessage}</span>
                                  </div>
                                )}
                              </div>
                            </a>
                          </Button>
                        </TooltipTrigger>
                         {animationsEnabled && (
                          <TooltipContent>
                             <p>{lastCommitMessage ? `Last commit: "${lastCommitMessage}"` : link.funnyText}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  }
                  if (link.platform === 'discord') {
                    return (
                      <Accordion type="single" collapsible className="w-full" key={link.platform}>
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className={cn("w-full justify-start h-auto min-h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent rounded-md px-4 py-2 hover:no-underline group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary", "[&[data-state=open]>svg]:text-primary")}>
                            <div className="flex items-center">
                              <SocialIcon platform={link.platform} className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                              <div className="flex flex-col items-start">
                                <span className={cn("transition-colors", animationsEnabled && "group-hover:text-primary")}>{link.text}</span>
                                {lanyardData && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <span className={cn("w-2 h-2 rounded-full mr-2", isAnyAccountOnline ? 'bg-green-500' : 'bg-gray-500')}></span>
                                     {isAnyAccountOnline ? 'Active' : 'Offline'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="mt-2 px-1 relative before:absolute before:left-6 before:top-0 before:bottom-2 before:w-px before:bg-primary/20 before:transition-all before:duration-300 data-[state=open]:before:top-2">
                            <div className="flex flex-col gap-3 pl-8 pr-2">
                               <Button
                                variant="secondary"
                                className={cn("w-full justify-start h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                                onClick={() => copyToClipboard('oi.hotaro', 'Discord')}
                              >
                                <Copy className="ml-2 mr-4 h-5 w-5 text-foreground/80 transition-colors group-hover:text-primary" />
                                <div className="flex flex-col items-start">
                                  <span className="transition-colors group-hover:text-primary">Main Account</span>
                                  <span className="text-xs text-muted-foreground">oi.hotaro</span>
                                </div>
                                {mainStatus && (
                                    <Badge variant="secondary" className="ml-auto text-xs font-medium self-center">
                                        <span className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(mainStatus))}></span>
                                        <span className="capitalize">{mainStatus}</span>
                                    </Badge>
                                )}
                              </Button>
                              <Button
                                variant="secondary"
                                className={cn("w-full justify-start h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                                onClick={() => copyToClipboard('Deleted', 'Discord')}
                              >
                                <Copy className="ml-2 mr-4 h-5 w-5 text-foreground/80 transition-colors group-hover:text-primary" />
                                <div className="flex flex-col items-start">
                                  <span className="transition-colors group-hover:text-primary">Alt Account</span>
                                  <span className="text-xs text-muted-foreground">Deleted</span>
                                </div>
                                {altStatus && (
                                    <Badge variant="secondary" className="ml-auto text-xs font-medium self-center">
                                        <span className={cn("w-2 h-2 rounded-full mr-2", getStatusColor(altStatus))}></span>
                                        <span className="capitalize">{altStatus}</span>
                                    </Badge>
                                )}
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }
                  
                  if (link.platform === 'spotify') {
                    const activity = spotifyLanyard?.activities?.find(a => a.type === 0);
                    return (
                      <Tooltip key={link.platform} delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            className={cn("w-full justify-start h-auto min-h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                            asChild
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <SocialIcon platform={link.platform} className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                              <div className="flex flex-col items-start">
                                <span className={cn("transition-colors", animationsEnabled && "group-hover:text-primary")}>{link.text}</span>
                                {spotifyLanyard?.listening_to_spotify && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Music className="h-3 w-3 mr-1.5 animate-pulse"/>
                                    <span>Listening...</span>
                                  </div>
                                )}
                              </div>
                            </a>
                          </Button>
                        </TooltipTrigger>
                        {animationsEnabled && (
                          <TooltipContent>
                            {spotifyLanyard?.listening_to_spotify ? (
                              <p>Listening to {spotifyLanyard.spotify.song} by {spotifyLanyard.spotify.artist}</p>
                            ) : (
                              <p>{link.funnyText}</p>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  }
                  
                  return (
                    <Tooltip key={link.platform} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          className={cn("w-full justify-start h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                          asChild
                        >
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <SocialIcon platform={link.platform} className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                            <span className={cn("transition-colors", animationsEnabled && "group-hover:text-primary")}>{link.text}</span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      {animationsEnabled && link.funnyText && (
                        <TooltipContent>
                          <p>{link.funnyText}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
                </TooltipProvider>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className={cn("w-full justify-start h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent rounded-md px-4 py-2 hover:no-underline group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary", "[&[data-state=open]>svg]:text-primary")}>
                      <span className={cn("flex items-center transition-colors", animationsEnabled && "group-hover:text-primary")}>
                        <SocialIcon platform="others" className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                        Others
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mt-2 px-1 relative before:absolute before:left-6 before:top-0 before:bottom-2 before:w-px before:bg-primary/20 before:transition-all before:duration-300 data-[state=open]:before:top-2">
                      <div className="flex flex-col gap-3 pl-8 pr-2">
                        {otherSocialLinks.map((link) => (
                           <Button
                            key={link.platform}
                            variant="secondary"
                            className={cn("w-full justify-start h-14 text-md bg-secondary/30 transition-all duration-300 ease-in-out transform border border-transparent group", animationsEnabled && "hover:bg-secondary/80 hover:text-primary hover:scale-[1.02] hover:border-primary")}
                            onClick={() => handleOtherLinkClick(link.platform, link.url)}
                          >
                            <div className="flex items-center w-full">
                              <SocialIcon platform={link.platform} className={cn("ml-2 mr-4 h-6 w-6 text-foreground/80 transition-colors", animationsEnabled && "group-hover:text-primary")} />
                              <span className={cn("transition-colors", animationsEnabled && "group-hover:text-primary")}>{link.text}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => setIsExpanded(!isExpanded)}>
                Wanna know more?
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="transition-all duration-500 ease-in-out overflow-hidden" style={{ width: isExpanded ? '22rem' : '0rem' }}>
          {isExpanded && (
            <Card className="h-full bg-card/80 backdrop-blur-sm border shadow-2xl shadow-primary/5 animate-wavy-in z-10 rounded-l-none border-l-0 dark:border-primary/10 border-primary/10">
              <CardHeader>
                <h2 className="relative inline-block text-xl font-bold font-headline text-foreground">
                  About Me
                  <span 
                    className="absolute bottom-[-8px] left-0 w-full h-[3px]"
                    style={{
                      background: "url('data:image/svg+xml;utf8,<svg width=\"100\" height=\"6\" viewBox=\"0 0 100 6\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 3 C 25 0, 75 6, 100 3\" stroke=\"hsl(var(--primary))\" fill=\"transparent\" stroke-width=\"2\"/></svg>') repeat-x"
                    }}
                  ></span>
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-handwriting text-lg">
                  {aboutMe.p1}
                </p>
                <p className="text-muted-foreground mt-4 font-handwriting text-lg">
                   {aboutMe.p2}
                </p>

                <div className="mt-4 text-center">
                    <Dialog open={isTranslateDialogOpen} onOpenChange={setIsTranslateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" size="sm">
                                <Languages className="mr-2 h-4 w-4" />
                                {currentLanguage === 'English' ? 'Translate' : `Translated to ${currentLanguage}`}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Translate "About Me"</DialogTitle>
                                <DialogDescription>
                                    Select a language to translate the text. The original is in English.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-3 gap-2">
                                    <Button onClick={() => handleTranslate('Japanese')} disabled={isTranslating}>Japanese</Button>
                                    <Button onClick={() => handleTranslate('Korean')} disabled={isTranslating}>Korean</Button>
                                    <Button onClick={() => handleTranslate('Hindi')} disabled={isTranslating}>Hindi</Button>
                                </div>
                                <Separator className="my-2" />
                                <div className="grid grid-cols-3 items-center gap-4">
                                     <Label htmlFor="other-language" className="text-right">
                                        Other
                                    </Label>
                                    <Select onValueChange={setOtherLanguage} value={otherLanguage}>
                                        <SelectTrigger className="col-span-2">
                                            <SelectValue placeholder="Select a language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {otherLanguages.map(lang => (
                                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {currentLanguage !== 'English' && (
                                    <>
                                    <Separator className="my-2"/>
                                     <Button variant="outline" onClick={() => handleTranslate('English')} disabled={isTranslating}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Revert to Original (English)
                                    </Button>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => handleTranslate(otherLanguage)} disabled={isTranslating || !otherLanguage}>
                                    {isTranslating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Translate
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {spotifyLanyard?.listening_to_spotify && (
                  <>
                    <Separator className="my-4 bg-transparent border-t border-dotted border-primary/20" />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Music className="h-4 w-4" />
                        <span>Now Playing on Spotify</span>
                      </div>
                       <a href={`https://open.spotify.com/track/${spotifyLanyard.spotify.track_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center w-full bg-secondary/30 p-2 rounded-md transition-colors hover:bg-secondary/80 group">
                        <div className="relative w-12 h-12 mr-3">
                          <Image src={spotifyLanyard.spotify.album_art_url} alt={spotifyLanyard.spotify.album} fill className="rounded-md object-cover"/>
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="font-semibold truncate text-sm text-foreground group-hover:text-primary transition-colors">{spotifyLanyard.spotify.song}</p>
                          <p className="text-muted-foreground text-xs truncate">by {spotifyLanyard.spotify.artist}</p>
                        </div>
                      </a>
                    </div>
                  </>
                )}

                <Separator className="my-4 bg-transparent border-t border-dotted border-primary/20" />
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {currentTime} (IST)
                </div>

                <Separator className="my-4 bg-transparent border-t border-dotted border-primary/20" />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="group"
                    onClick={() => setIsSurpriseExpanded(!isSurpriseExpanded)}
                  >
                    <Gift className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                    Surprise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="transition-all duration-500 ease-in-out overflow-hidden" style={{ width: isSurpriseExpanded ? '22rem' : '0rem' }}>
          {isSurpriseExpanded && (
            <Card className="h-full bg-card/80 backdrop-blur-sm border shadow-2xl shadow-primary/5 animate-wavy-in z-10 rounded-l-none border-l-0 dark:border-primary/10 border-primary/10">
              <CardHeader>
                 <h2 className="relative inline-block text-xl font-bold font-headline text-foreground">
                  A Secret...
                  <span 
                    className="absolute bottom-[-8px] left-0 w-full h-[3px]"
                    style={{
                      background: "url('data:image/svg+xml;utf8,<svg width=\"100\" height=\"6\" viewBox=\"0 0 100 6\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 3 C 25 0, 75 6, 100 3\" stroke=\"hsl(var(--primary))\" fill=\"transparent\" stroke-width=\"2\"/></svg>') repeat-x"
                    }}
                  ></span>
                </h2>
                <p className="text-muted-foreground text-sm pt-2">my owners (˶˃ ᵕ ˂˶)</p>
              </CardHeader>
              <CardContent>
                <Carousel 
                  plugins={[autoplayPlugin.current]}
                  className="w-full max-w-xs mx-auto"
                  onMouseEnter={autoplayPlugin.current.stop}
                  onMouseLeave={autoplayPlugin.current.reset}
                >
                  <CarouselContent>
                    {carouselImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-0">
                               <Image
                                  src={image.imageUrl}
                                  alt={image.description}
                                  width={400}
                                  height={400}
                                  className="rounded-md object-cover w-full h-full"
                                  data-ai-hint={image.imageHint}
                                />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                
                <Separator className="my-6 bg-transparent border-t border-dotted border-primary/20" />

                <Carousel className="w-full max-w-xs mx-auto relative">
                    <CarouselContent>
                        <CarouselItem>
                            <Card className="bg-secondary/30 border-none h-full relative overflow-hidden" onClick={handleCardClick}>
                                <CardHeader>
                                <CardTitle className="text-lg font-bold font-headline text-foreground">Favorites</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm pb-10">
                                <div className="flex items-start gap-3 mb-3">
                                    <MicVocal className="h-5 w-5 mt-0.5 text-primary/80" />
                                    <p><strong className="font-medium text-foreground/90">Artists:</strong> Joji, Lana Del Rey, Beabadoobee, TV Girl, Sia, Cigarettes After Sex, Laufey, Lisa, Jennie, etc.</p>
                                </div>
                                <div className="flex items-start gap-3 mb-3">
                                    <BookOpen className="h-5 w-5 mt-0.5 text-primary/80" />
                                    <p><strong className="font-medium text-foreground/90">Manga:</strong> Vagabond, Berserk, Chainsaw Man, Junji Ito's collection, The Climber</p>
                                </div>
                                <div className="flex items-start gap-3 mb-3">
                                    <Clapperboard className="h-5 w-5 mt-0.5 text-primary/80" />
                                    <p><strong className="font-medium text-foreground/90">Anime:</strong> Attack on Titan, Demon Slayer, Chainsaw Man, Tokyo Revengers, Makoto Shinkai's & Ghibli movies</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Utensils className="h-5 w-5 mt-0.5 text-primary/80" />
                                    <p><strong className="font-medium text-foreground/90">Food:</strong> Biryani, Fried Rice, Paneer Veggies, Burgers</p>
                                </div>
                                <div className="absolute bottom-2 right-4 flex items-center gap-1 text-xs text-muted-foreground animate-pulse-horizontal">
                                    <ChevronsLeftRight className="h-3 w-3" />
                                    <span>swipe</span>
                                </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card className="bg-secondary/30 border-none h-full relative overflow-hidden" onClick={handleCardClick}>
                                <CardHeader>
                                <CardTitle className="text-lg font-bold font-headline text-foreground">More About Me</CardTitle>
                                </CardHeader>
                                <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    MBTI: INTJ. I'm a minor who likes cats and eating yummy foods! I love watching anime, reading manga and self-improvement books. I listen to music a lot too. I hate rude and impulsive human beings. Also I've a bad habit of overthinking every stuff...
                                </p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

                <div className="text-center">
                  <Button
                      variant="link"
                      className="mt-4"
                      onClick={() => setIsSurpriseExpanded(false)}
                    >
                      Hide this again
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
