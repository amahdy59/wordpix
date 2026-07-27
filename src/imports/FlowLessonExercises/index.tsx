import svgPaths from "./svg-2zwti0wuib";
import imgBedroomIllustration from "./f411eef2ec377eccc68c6aac19dbead822b0265e.png";
import imgSceneInteractive from "./5a1564d371eaf16d42bd6410fe9570da379f3ec4.png";
import imgPillowImage from "./c7cadc27876c16a199d0716313196906c0c06d60.png";
import imgLampImage from "./dba5c5c3f4284abc29fd85fa10a43dffe2da0260.png";
import imgClueImage from "./c671a908cb680b90c365222b2c54c47cf545dddb.png";
import imgLampOnDesk from "./721329bd75e4bbf10288efde368471b90071bfab.png";
import imgPillowImg from "./b698b3088160f7b37e9b5a8edf116c54da4d6b80.png";
import imgBlanketImg from "./aa90bb374d98c03bdf3acd393ca863222b5b2fed.png";
import imgCurtainImg from "./a52428433e982eca881c434461451e56ed709b9d.png";
import imgRugImg from "./a5139fec0e9a48c4a9a35a5dadba1c0846b96bc7.png";
import imgThumb from "./0a139d976e52f612dd5d5dbb8fcbf18926b4f179.png";
import imgThumb1 from "./f31b545ac50307d36e3be5bcb74b599a485e5566.png";
import imgThumb2 from "./910c992196ce105171d84eaf99f6dfd041757724.png";

function IosSignal() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal />
      <IosWifiSignal />
      <IosBatteryFull />
    </div>
  );
}

function IosSignal1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal1 />
      <IosWifiSignal1 />
      <IosBatteryFull1 />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft />
    </div>
  );
}

function Back() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper />
    </div>
  );
}

function HeaderFrame() {
  return <div className="relative shrink-0 size-[32px]" data-name="header-frame" />;
}

function HeaderBar() {
  return (
    <div className="relative shrink-0 w-full" data-name="HeaderBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pt-[12px] px-[24px] relative size-full">
          <Back />
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Level 1</p>
          <HeaderFrame />
        </div>
      </div>
    </div>
  );
}

function TitleGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="TitleGroup">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[30px] relative shrink-0 text-[#171717] text-[20px]">The Bedroom</p>
      <p className="font-['Inter:Semi_Bold','Noto_Sans_Arabic:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#cc6363] text-[14px]" dir="auto">
        غرفة النوم • 12 words to learn
      </p>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative shrink-0 w-full" data-name="HeroPreview">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] relative size-full">
        <div className="h-[180px] relative rounded-[24px] shrink-0 w-full" data-name="BedroomIllustration">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgBedroomIllustration} />
        </div>
        <TitleGroup />
      </div>
    </div>
  );
}

function Texts() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="Texts">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">New Words</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#525252] text-[12px]">4 words remaining</p>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper1() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ChevronRight />
    </div>
  );
}

function ProgressItem() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="ProgressItem">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="DotIndicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <circle cx="8" cy="8" fill="var(--fill-0, #CC6363)" id="CheckIcon" r="8" />
            </svg>
          </div>
          <Texts />
          <IconWrapper1 />
        </div>
      </div>
    </div>
  );
}

function Texts1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="Texts">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">Practice</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#525252] text-[12px]">4 words to review</p>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ChevronRight1 />
    </div>
  );
}

function ProgressItem1() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="ProgressItem">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="DotIndicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <circle cx="8" cy="8" fill="var(--fill-0, #FFD600)" id="DotIndicator" r="8" />
            </svg>
          </div>
          <Texts1 />
          <IconWrapper2 />
        </div>
      </div>
    </div>
  );
}

function Texts2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="Texts">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">Mastered</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#525252] text-[12px]">4 words mastered</p>
    </div>
  );
}

function ChevronRight2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper3() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ChevronRight2 />
    </div>
  );
}

function ProgressItem2() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="ProgressItem">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative shrink-0 size-[16px]" data-name="DotIndicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
              <circle cx="8" cy="8" fill="var(--fill-0, #40A673)" id="XpIcon" r="8" />
            </svg>
          </div>
          <Texts2 />
          <IconWrapper3 />
        </div>
      </div>
    </div>
  );
}

function ProgressSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="ProgressSection">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] relative size-full">
        <ProgressItem />
        <ProgressItem1 />
        <ProgressItem2 />
      </div>
    </div>
  );
}

function ScrollableContent() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ScrollableContent">
      <StatusBar />
      <HeaderBar />
      <HeroPreview />
      <ProgressSection />
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Start Lesson</p>
        </div>
      </div>
    </div>
  );
}

function LessonWorldEntry() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="lesson/world-entry">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons />
      </div>
      <ScrollableContent />
      <Footer />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal2() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal2() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull2() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal2 />
      <IosWifiSignal2 />
      <IosBatteryFull2 />
    </div>
  );
}

function IosSignal3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal3 />
      <IosWifiSignal3 />
      <IosBatteryFull3 />
    </div>
  );
}

function StatusBar1() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons1 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper4() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft1 />
    </div>
  );
}

function Back1() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper4 />
    </div>
  );
}

function XCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper5() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle />
    </div>
  );
}

function Close() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper5 />
    </div>
  );
}

function TopRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back1 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">The Bedroom</p>
      <Close />
    </div>
  );
}

function HeaderFrame1() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[50px]" data-name="fill" />
    </div>
  );
}

function LessonHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow />
        <HeaderFrame1 />
      </div>
    </div>
  );
}

function HotspotBed() {
  return (
    <div className="absolute left-[120px] size-[28px] top-[220px]" data-name="HotspotBed">
      <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
        <g id="HotspotBed">
          <rect fill="var(--fill-0, white)" height="26" rx="13" width="26" x="1" y="1" />
          <rect height="26" rx="13" stroke="var(--stroke-0, #CC6363)" strokeWidth="2" width="26" x="1" y="1" />
          <circle cx="14" cy="14" fill="var(--fill-0, #CC6363)" id="hotspot-dot" r="6" />
        </g>
      </svg>
    </div>
  );
}

function HotspotWardrobe() {
  return (
    <div className="absolute left-[240px] size-[28px] top-[150px]" data-name="HotspotWardrobe">
      <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
        <g id="HotspotBed">
          <rect fill="var(--fill-0, white)" height="26" rx="13" width="26" x="1" y="1" />
          <rect height="26" rx="13" stroke="var(--stroke-0, #CC6363)" strokeWidth="2" width="26" x="1" y="1" />
          <circle cx="14" cy="14" fill="var(--fill-0, #CC6363)" id="hotspot-dot" r="6" />
        </g>
      </svg>
    </div>
  );
}

function HotspotLamp() {
  return (
    <div className="absolute left-[40px] size-[28px] top-[180px]" data-name="HotspotLamp">
      <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
        <g id="HotspotBed">
          <rect fill="var(--fill-0, white)" height="26" rx="13" width="26" x="1" y="1" />
          <rect height="26" rx="13" stroke="var(--stroke-0, #CC6363)" strokeWidth="2" width="26" x="1" y="1" />
          <circle cx="14" cy="14" fill="var(--fill-0, #CC6363)" id="hotspot-dot" r="6" />
        </g>
      </svg>
    </div>
  );
}

function Sparkles() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="sparkles">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g clipPath="url(#clip0_1_1756)" id="sparkles">
          <path d={svgPaths.p1bbba4f0} id="icon-0" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1756">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper6() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-name="IconWrapper">
      <Sparkles />
    </div>
  );
}

function HotspotPillowActive() {
  return (
    <div className="absolute bg-[rgba(255,214,0,0.8)] content-stretch flex items-start left-[180px] p-[6px] rounded-[99px] top-[240px]" data-name="HotspotPillowActive">
      <div aria-hidden className="absolute border-3 border-solid border-white inset-0 pointer-events-none rounded-[99px]" />
      <IconWrapper6 />
    </div>
  );
}

function SceneInteractive() {
  return (
    <div className="h-[440px] relative shrink-0 w-full" data-name="SceneInteractive">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSceneInteractive} />
      <HotspotBed />
      <HotspotWardrobe />
      <HotspotLamp />
      <HotspotPillowActive />
    </div>
  );
}

function MainFlow() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="MainFlow">
      <StatusBar1 />
      <LessonHeader />
      <SceneInteractive />
    </div>
  );
}

function LeftGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-name="LeftGroup">
      <p className="font-['Inter:Black',sans-serif] font-black relative shrink-0 text-[#cc6363] text-[28px]">Pillow</p>
      <p className="font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold relative shrink-0 text-[#525252] text-[18px]" dir="auto">
        وسادة (wi-sa-dah)
      </p>
    </div>
  );
}

function Volume() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="volume-2">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="volume-2">
          <path d={svgPaths.p3b377f00} id="icon-0" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper7() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[24px]" data-name="IconWrapper">
      <Volume />
    </div>
  );
}

function AudioPlay() {
  return (
    <div className="bg-[#fdecec] content-stretch flex items-start p-[12px] relative rounded-[99px] shrink-0" data-name="AudioPlay">
      <IconWrapper7 />
    </div>
  );
}

function CardTitleRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="CardTitleRow">
      <LeftGroup />
      <AudioPlay />
    </div>
  );
}

function SlidingBottomCard() {
  return (
    <div className="bg-white relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 w-full" data-name="SlidingBottomCard">
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[40px] pt-[20px] px-[24px] relative size-full">
        <CardTitleRow />
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Learn Word</p>
        </div>
      </div>
    </div>
  );
}

function LessonSceneDiscovery() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="lesson/scene-discovery">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons1 />
      </div>
      <MainFlow />
      <SlidingBottomCard />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal4() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal4() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull4() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons2() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal4 />
      <IosWifiSignal4 />
      <IosBatteryFull4 />
    </div>
  );
}

function IosSignal5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons2() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal5 />
      <IosWifiSignal5 />
      <IosBatteryFull5 />
    </div>
  );
}

function StatusBar2() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons2 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper8() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft2 />
    </div>
  );
}

function Back2() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper8 />
    </div>
  );
}

function XCircle1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper9() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle1 />
    </div>
  );
}

function Close1() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper9 />
    </div>
  );
}

function TopRow1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back2 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">{`Listen & Repeat`}</p>
      <Close1 />
    </div>
  );
}

function HeaderFrame2() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[75px]" data-name="fill" />
    </div>
  );
}

function LessonHeader1() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow1 />
        <HeaderFrame2 />
      </div>
    </div>
  );
}

function IllustrationContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[220px] items-center justify-center relative rounded-[32px] shrink-0 w-full" data-name="IllustrationContainer">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="relative shrink-0 size-[160px]" data-name="PillowImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPillowImage} />
      </div>
    </div>
  );
}

function Phonetics() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-center leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Phonetics">
      <p className="font-['Inter:Black',sans-serif] font-black relative shrink-0 text-[#cc6363] text-[32px]">Pillow</p>
      <p className="font-['Inter:Semi_Bold','Noto_Sans_Arabic:SemiBold',sans-serif] font-semibold relative shrink-0 text-[#525252] text-[20px]" dir="auto">
        وسادة • wi-sa-dah
      </p>
    </div>
  );
}

function Volume1() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="volume-2">
      <svg className="absolute block inset-0 size-full" fill="none" height="40" preserveAspectRatio="none" viewBox="0 0 40 40" width="40">
        <g id="volume-2">
          <path d={svgPaths.p17ee4f00} id="icon-0" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper10() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[40px]" data-name="IconWrapper">
      <Volume1 />
    </div>
  );
}

function GiantSpeaker() {
  return (
    <div className="bg-[#cc6363] content-stretch flex items-start p-[24px] relative rounded-[99px] shrink-0" data-name="GiantSpeaker">
      <IconWrapper10 />
    </div>
  );
}

function MainBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="MainBody">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[20px] items-center px-[24px] relative size-full">
          <IllustrationContainer />
          <Phonetics />
          <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#40a673] text-[16px] whitespace-nowrap">Say it out loud!</p>
          <GiantSpeaker />
        </div>
      </div>
    </div>
  );
}

function ContentGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ContentGroup">
      <StatusBar2 />
      <LessonHeader1 />
      <MainBody />
    </div>
  );
}

function ListenAgain() {
  return (
    <div className="bg-white content-stretch flex h-[50px] items-center justify-center relative rounded-[20px] shrink-0 w-full" data-name="ListenAgain">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Listen Again</p>
    </div>
  );
}

function Footer1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Got It!</p>
        </div>
        <ListenAgain />
      </div>
    </div>
  );
}

function ExerciseListenRepeat() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="exercise/listen-repeat">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons2 />
      </div>
      <ContentGroup />
      <Footer1 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal6() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal6() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull6() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal6 />
      <IosWifiSignal6 />
      <IosBatteryFull6 />
    </div>
  );
}

function IosSignal7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal7 />
      <IosWifiSignal7 />
      <IosBatteryFull7 />
    </div>
  );
}

function StatusBar3() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons3 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper11() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft3 />
    </div>
  );
}

function Back3() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper11 />
    </div>
  );
}

function XCircle2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper12() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle2 />
    </div>
  );
}

function Close2() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper12 />
    </div>
  );
}

function TopRow2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back3 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">What is this?</p>
      <Close2 />
    </div>
  );
}

function HeaderFrame3() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[125px]" data-name="fill" />
    </div>
  );
}

function LessonHeader2() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow2 />
        <HeaderFrame3 />
      </div>
    </div>
  );
}

function ImageContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[200px] items-center justify-center relative rounded-[32px] shrink-0 w-full" data-name="ImageContainer">
      <div className="relative shrink-0 size-[140px]" data-name="LampImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLampImage} />
      </div>
    </div>
  );
}

function OptionLamp() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="OptionLamp">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
          <div className="relative shrink-0 size-[20px]" data-name="indicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
              <circle cx="10" cy="10" fill="var(--fill-0, #CC6363)" id="indicator" r="10" />
            </svg>
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#cc6363] text-[16px] whitespace-nowrap">Lamp</p>
        </div>
      </div>
    </div>
  );
}

function OptionPillow() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="OptionPillow">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
          <div className="relative shrink-0 size-[20px]" data-name="indicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
              <circle cx="10" cy="10" fill="var(--fill-0, white)" id="indicator" r="9" stroke="var(--stroke-0, #E5E5E5)" strokeWidth="2" />
            </svg>
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Pillow</p>
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Row1">
      <OptionLamp />
      <OptionPillow />
    </div>
  );
}

function OptionBed() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="OptionBed">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
          <div className="relative shrink-0 size-[20px]" data-name="indicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
              <circle cx="10" cy="10" fill="var(--fill-0, white)" id="indicator" r="9" stroke="var(--stroke-0, #E5E5E5)" strokeWidth="2" />
            </svg>
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Bed</p>
        </div>
      </div>
    </div>
  );
}

function OptionMirror() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="OptionMirror">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
          <div className="relative shrink-0 size-[20px]" data-name="indicator">
            <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
              <circle cx="10" cy="10" fill="var(--fill-0, white)" id="indicator" r="9" stroke="var(--stroke-0, #E5E5E5)" strokeWidth="2" />
            </svg>
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Mirror</p>
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Row2">
      <OptionBed />
      <OptionMirror />
    </div>
  );
}

function AnswerGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="AnswerGrid">
      <Row />
      <Row1 />
    </div>
  );
}

function QuestionSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="QuestionSection">
      <div className="content-stretch flex flex-col gap-[20px] items-start px-[24px] relative size-full">
        <ImageContainer />
        <AnswerGrid />
      </div>
    </div>
  );
}

function ContentGroup1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ContentGroup">
      <StatusBar3 />
      <LessonHeader2 />
      <QuestionSection />
    </div>
  );
}

function Footer2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Check Answer</p>
        </div>
      </div>
    </div>
  );
}

function ExerciseRecallMatch() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="exercise/recall-match">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons3 />
      </div>
      <ContentGroup1 />
      <Footer2 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal8() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal8() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull8() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal8 />
      <IosWifiSignal8 />
      <IosBatteryFull8 />
    </div>
  );
}

function IosSignal9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal9 />
      <IosWifiSignal9 />
      <IosBatteryFull9 />
    </div>
  );
}

function StatusBar4() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons4 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper13() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft4 />
    </div>
  );
}

function Back4() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper13 />
    </div>
  );
}

function XCircle3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper14() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle3 />
    </div>
  );
}

function Close3() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper14 />
    </div>
  );
}

function TopRow3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back4 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Complete the Sentence</p>
      <Close3 />
    </div>
  );
}

function HeaderFrame4() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[175px]" data-name="fill" />
    </div>
  );
}

function LessonHeader3() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow3 />
        <HeaderFrame4 />
      </div>
    </div>
  );
}

function ClueContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[160px] items-center justify-center relative rounded-[24px] shrink-0 w-full" data-name="ClueContainer">
      <div className="relative shrink-0 size-[120px]" data-name="ClueImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClueImage} />
      </div>
    </div>
  );
}

function UnderlineBlank() {
  return (
    <div className="content-stretch flex items-start pb-[4px] px-[16px] relative shrink-0" data-name="UnderlineBlank">
      <div aria-hidden className="absolute border-[#cc6363] border-b-4 border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#cc6363] text-[20px] whitespace-nowrap">pillow</p>
    </div>
  );
}

function InteractiveText() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="InteractiveText">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap">The</p>
      <UnderlineBlank />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap">is on the bed.</p>
    </div>
  );
}

function SentencePrompt() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="SentencePrompt">
      <InteractiveText />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold','Noto_Sans_Arabic:SemiBold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[18px] whitespace-nowrap" dir="auto">
        الوسادة على السرير.
      </p>
    </div>
  );
}

function ChipSelected() {
  return (
    <div className="bg-[#fdecec] content-stretch flex items-start px-[20px] py-[12px] relative rounded-[16px] shrink-0" data-name="ChipSelected">
      <div aria-hidden className="absolute border-2 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">pillow</p>
    </div>
  );
}

function ChipDefault() {
  return (
    <div className="bg-white content-stretch flex items-start px-[20px] py-[12px] relative rounded-[16px] shrink-0" data-name="ChipDefault1">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">lamp</p>
    </div>
  );
}

function ChipDefault1() {
  return (
    <div className="bg-white content-stretch flex items-start px-[20px] py-[12px] relative rounded-[16px] shrink-0" data-name="ChipDefault2">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">door</p>
    </div>
  );
}

function ChipDefault2() {
  return (
    <div className="bg-white content-stretch flex items-start px-[20px] py-[12px] relative rounded-[16px] shrink-0" data-name="ChipDefault3">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">chair</p>
    </div>
  );
}

function HorizontalChips() {
  return (
    <div className="content-start flex flex-wrap gap-[10px] items-start relative shrink-0 w-full" data-name="HorizontalChips">
      <ChipSelected />
      <ChipDefault />
      <ChipDefault1 />
      <ChipDefault2 />
    </div>
  );
}

function MainBody1() {
  return (
    <div className="relative shrink-0 w-full" data-name="MainBody">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] relative size-full">
        <ClueContainer />
        <SentencePrompt />
        <HorizontalChips />
      </div>
    </div>
  );
}

function ContentGroup2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ContentGroup">
      <StatusBar4 />
      <LessonHeader3 />
      <MainBody1 />
    </div>
  );
}

function Footer3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Next</p>
        </div>
      </div>
    </div>
  );
}

function ExerciseContextFill() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="exercise/context-fill">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons4 />
      </div>
      <ContentGroup2 />
      <Footer3 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal10() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal10() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull10() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal10 />
      <IosWifiSignal10 />
      <IosBatteryFull10 />
    </div>
  );
}

function IosSignal11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal11 />
      <IosWifiSignal11 />
      <IosBatteryFull11 />
    </div>
  );
}

function StatusBar5() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons5 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper15() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft5 />
    </div>
  );
}

function Back5() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper15 />
    </div>
  );
}

function XCircle4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper16() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle4 />
    </div>
  );
}

function Close4() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper16 />
    </div>
  );
}

function TopRow4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back5 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Build a Sentence</p>
      <Close4 />
    </div>
  );
}

function HeaderFrame5() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[225px]" data-name="fill" />
    </div>
  );
}

function LessonHeader4() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow4 />
        <HeaderFrame5 />
      </div>
    </div>
  );
}

function SceneBox() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[140px] items-center justify-center relative rounded-[24px] shrink-0 w-full" data-name="SceneBox">
      <div className="h-[120px] relative rounded-[16px] shrink-0 w-[200px]" data-name="LampOnDesk">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgLampOnDesk} />
      </div>
    </div>
  );
}

function Placed() {
  return (
    <div className="bg-[#fdecec] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[12px] shrink-0" data-name="Placed1">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">The</p>
    </div>
  );
}

function Placed1() {
  return (
    <div className="bg-[#fdecec] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[12px] shrink-0" data-name="Placed2">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">lamp</p>
    </div>
  );
}

function Placed2() {
  return (
    <div className="bg-[#fdecec] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[12px] shrink-0" data-name="Placed3">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">is</p>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="bg-[#f7f7f7] h-[34px] relative rounded-[12px] shrink-0 w-[60px]" data-name="EmptySlot">
      <div aria-hidden className="absolute border-2 border-[#cc6363] border-dashed inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function PlacedChips() {
  return (
    <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full" data-name="PlacedChips">
      <Placed />
      <Placed1 />
      <Placed2 />
      <EmptySlot />
    </div>
  );
}

function AnswerArea() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="AnswerArea">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
        <PlacedChips />
      </div>
    </div>
  );
}

function PoolWord() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[10px] relative rounded-[16px] shrink-0" data-name="PoolWord1">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">on</p>
    </div>
  );
}

function PoolWord1() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[10px] relative rounded-[16px] shrink-0" data-name="PoolWord2">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">the</p>
    </div>
  );
}

function PoolWord2() {
  return (
    <div className="bg-white content-stretch flex items-start px-[16px] py-[10px] relative rounded-[16px] shrink-0" data-name="PoolWord3">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">desk</p>
    </div>
  );
}

function PoolChips() {
  return (
    <div className="content-start flex flex-wrap gap-[10px] items-start relative shrink-0 w-full" data-name="PoolChips">
      <PoolWord />
      <PoolWord1 />
      <PoolWord2 />
    </div>
  );
}

function WordPool() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="WordPool">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap">Tap the words to build:</p>
      <PoolChips />
    </div>
  );
}

function Workspace() {
  return (
    <div className="relative shrink-0 w-full" data-name="Workspace">
      <div className="content-stretch flex flex-col gap-[20px] items-start px-[24px] relative size-full">
        <SceneBox />
        <AnswerArea />
        <WordPool />
      </div>
    </div>
  );
}

function ContentGroup3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ContentGroup">
      <StatusBar5 />
      <LessonHeader4 />
      <Workspace />
    </div>
  );
}

function Footer4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Submit</p>
        </div>
      </div>
    </div>
  );
}

function ExerciseSentenceBuilder() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="exercise/sentence-builder">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons5 />
      </div>
      <ContentGroup3 />
      <Footer4 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal12() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal12() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull12() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons6() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal12 />
      <IosWifiSignal12 />
      <IosBatteryFull12 />
    </div>
  );
}

function IosSignal13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull13() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons6() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal13 />
      <IosWifiSignal13 />
      <IosBatteryFull13 />
    </div>
  );
}

function StatusBar6() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons6 />
        </div>
      </div>
    </div>
  );
}

function ArrowLeft6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="arrow-left">
          <path d={svgPaths.pe197860} id="icon-arrow" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper17() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <ArrowLeft6 />
    </div>
  );
}

function Back6() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Back">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper17 />
    </div>
  );
}

function XCircle5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x-circle">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_1_1716)" id="x-circle">
          <path d={svgPaths.p30250f00} id="icon-0" stroke="var(--stroke-0, #525252)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1716">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper18() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <XCircle5 />
    </div>
  );
}

function Close5() {
  return (
    <div className="bg-white content-stretch flex items-start p-[8px] relative rounded-[12px] shrink-0" data-name="Close">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconWrapper18 />
    </div>
  );
}

function TopRow5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="TopRow">
      <Back6 />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">Quick Quiz</p>
      <Close5 />
    </div>
  );
}

function HeaderFrame6() {
  return (
    <div className="bg-[#fafafa] h-[8px] relative rounded-[99px] shrink-0 w-full" data-name="header-frame">
      <div className="absolute bg-[#cc6363] h-[8px] left-0 rounded-[99px] top-0 w-[250px]" data-name="fill" />
    </div>
  );
}

function LessonHeader5() {
  return (
    <div className="relative shrink-0 w-full" data-name="LessonHeader">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] py-[12px] relative size-full">
        <TopRow5 />
        <HeaderFrame6 />
      </div>
    </div>
  );
}

function Clock() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="clock">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_1_1728)" id="clock">
          <path d={svgPaths.p3da783c0} id="icon-lock" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1728">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper19() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
      <Clock />
    </div>
  );
}

function Timer() {
  return (
    <div className="bg-[#fdecec] content-stretch flex gap-[4px] items-center px-[10px] py-[4px] relative rounded-[12px] shrink-0" data-name="Timer">
      <IconWrapper19 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[12px] whitespace-nowrap">0:45</p>
    </div>
  );
}

function QuestionHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="QuestionHeader">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap">{`Which one is the "pillow"?`}</p>
          <Timer />
        </div>
      </div>
    </div>
  );
}

function CardPillow() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="CardPillow">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center p-[12px] relative size-full">
          <div className="h-[90px] relative rounded-[12px] shrink-0 w-[110px]" data-name="PillowImg">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgPillowImg} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">Pillow</p>
        </div>
      </div>
    </div>
  );
}

function CardBlanket() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="CardBlanket">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center p-[12px] relative size-full">
          <div className="h-[90px] relative rounded-[12px] shrink-0 w-[110px]" data-name="BlanketImg">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBlanketImg} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Blanket</p>
        </div>
      </div>
    </div>
  );
}

function GridRow() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="GridRow1">
      <CardPillow />
      <CardBlanket />
    </div>
  );
}

function CardCurtain() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="CardCurtain">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center p-[12px] relative size-full">
          <div className="h-[90px] relative rounded-[12px] shrink-0 w-[110px]" data-name="CurtainImg">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgCurtainImg} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Curtain</p>
        </div>
      </div>
    </div>
  );
}

function CardRug() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="CardRug">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center p-[12px] relative size-full">
          <div className="h-[90px] relative rounded-[12px] shrink-0 w-[110px]" data-name="RugImg">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgRugImg} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Rug</p>
        </div>
      </div>
    </div>
  );
}

function GridRow1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="GridRow2">
      <CardCurtain />
      <CardRug />
    </div>
  );
}

function CardsGrid() {
  return (
    <div className="relative shrink-0 w-full" data-name="CardsGrid">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] relative size-full">
        <GridRow />
        <GridRow1 />
      </div>
    </div>
  );
}

function ContentGroup4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ContentGroup">
      <StatusBar6 />
      <LessonHeader5 />
      <QuestionHeader />
      <CardsGrid />
    </div>
  );
}

function Footer5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Check</p>
        </div>
      </div>
    </div>
  );
}

function ExerciseQuickQuiz() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="exercise/quick-quiz">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons6 />
      </div>
      <ContentGroup4 />
      <Footer5 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal14() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal14() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull14() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons7() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal14 />
      <IosWifiSignal14 />
      <IosBatteryFull14 />
    </div>
  );
}

function IosSignal15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons7() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal15 />
      <IosWifiSignal15 />
      <IosBatteryFull15 />
    </div>
  );
}

function StatusBar7() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons7 />
        </div>
      </div>
    </div>
  );
}

function Trophy() {
  return (
    <div className="relative shrink-0 size-[64px]" data-name="trophy">
      <svg className="absolute block inset-0 size-full" fill="none" height="64" preserveAspectRatio="none" viewBox="0 0 64 64" width="64">
        <g id="trophy">
          <path d={svgPaths.p2f84d8a0} id="icon-0" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper20() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[64px]" data-name="IconWrapper">
      <Trophy />
    </div>
  );
}

function TrophyBox() {
  return (
    <div className="bg-[#ffd600] content-stretch flex flex-col items-center justify-center relative rounded-[99px] shrink-0 size-[120px]" data-name="TrophyBox">
      <IconWrapper20 />
    </div>
  );
}

function Texts3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-center leading-[normal] not-italic relative shrink-0 text-center whitespace-nowrap" data-name="Texts">
      <p className="font-['Inter:Black',sans-serif] font-black relative shrink-0 text-[#cc6363] text-[32px]">Great Work!</p>
      <p className="font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold relative shrink-0 text-[#171717] text-[18px]" dir="auto">
        أداء رائع ومميز!
      </p>
    </div>
  );
}

function CelebHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="CelebHeader">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center px-[24px] relative size-full">
          <TrophyBox />
          <Texts3 />
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Row1" />;
}

function Row3() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="Row2" />;
}

function StatsGrid() {
  return (
    <div className="relative shrink-0 w-full" data-name="StatsGrid">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[24px] relative size-full">
        <Row2 />
        <Row3 />
      </div>
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="star">
          <path d={svgPaths.p135a8080} id="icon-star" stroke="var(--stroke-0, #FFD600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper21() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[32px]" data-name="IconWrapper">
      <Star />
    </div>
  );
}

function Star1() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" height="48" preserveAspectRatio="none" viewBox="0 0 48 48" width="48">
        <g id="star">
          <path d={svgPaths.p3a5b4c00} id="icon-star" stroke="var(--stroke-0, #FFD600)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper22() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[48px]" data-name="IconWrapper">
      <Star1 />
    </div>
  );
}

function Star2() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="star">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="star">
          <path d={svgPaths.p135a8080} id="icon-star" stroke="var(--stroke-0, #E5E5E5)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper23() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[32px]" data-name="IconWrapper">
      <Star2 />
    </div>
  );
}

function StarsRating() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="StarsRating">
      <IconWrapper21 />
      <IconWrapper22 />
      <IconWrapper23 />
    </div>
  );
}

function ScrollableArea() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="ScrollableArea">
      <StatusBar7 />
      <CelebHeader />
      <StatsGrid />
      <StarsRating />
    </div>
  );
}

function PracticeAgain() {
  return (
    <div className="bg-white content-stretch flex h-[50px] items-center justify-center relative rounded-[20px] shrink-0 w-full" data-name="PracticeAgain">
      <div aria-hidden className="absolute border-[#e5e5e5] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Practice Again</p>
    </div>
  );
}

function Footer6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[40px] pt-[16px] px-[24px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Continue to Next</p>
        </div>
        <PracticeAgain />
      </div>
    </div>
  );
}

function LessonCompleteResults() {
  return (
    <div className="bg-[#fdecec] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="lesson/complete-results">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons7 />
      </div>
      <ScrollableArea />
      <Footer6 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal16() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 17 11" width="17">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2d6ad970} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal16() {
  return (
    <div className="h-[11px] relative shrink-0 w-[15px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 15 11" width="15">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p190a1500} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull16() {
  return (
    <div className="h-[12px] relative shrink-0 w-[25px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 25 12" width="25">
        <g id="ios-battery-full">
          <path d={svgPaths.pde03700} fill="var(--fill-0, #0F172A)" id="icon-path" />
        </g>
      </svg>
    </div>
  );
}

function StatusIcons8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="status-icons">
      <IosSignal16 />
      <IosWifiSignal16 />
      <IosBatteryFull16 />
    </div>
  );
}

function IosSignal17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-signal">
          <path clipRule="evenodd" d={svgPaths.p2bb6eb80} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosWifiSignal17() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ios-wifi-signal">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="ios-wifi-signal">
          <path clipRule="evenodd" d={svgPaths.p646c5c0} fill="var(--fill-0, #171717)" fillRule="evenodd" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function IosBatteryFull17() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="ios-battery-full">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 28 20" width="28">
        <g id="ios-battery-full">
          <path d={svgPaths.p66c9640} fill="var(--fill-0, #171717)" id="icon-0" />
        </g>
      </svg>
    </div>
  );
}

function Icons8() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal17 />
      <IosWifiSignal17 />
      <IosBatteryFull17 />
    </div>
  );
}

function StatusBar8() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="StatusBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
          <Icons8 />
        </div>
      </div>
    </div>
  );
}

function Texts4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="Texts">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[30px] relative shrink-0 text-[#171717] text-[20px]">Review Time!</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#cc6363] text-[14px]">5 words need review today</p>
    </div>
  );
}

function Flame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="flame">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="flame">
          <path d={svgPaths.p38bc1900} id="icon-flame" stroke="var(--stroke-0, #CC6363)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper24() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="IconWrapper">
      <Flame />
    </div>
  );
}

function FlameStreak() {
  return (
    <div className="bg-[#fdecec] content-stretch flex gap-[4px] items-center px-[12px] py-[6px] relative rounded-[16px] shrink-0" data-name="FlameStreak">
      <IconWrapper24 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[14px] whitespace-nowrap">5 Days</p>
    </div>
  );
}

function PageTitleHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="PageTitleHeader">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Texts4 />
          <FlameStreak />
        </div>
      </div>
    </div>
  );
}

function Middle() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="Middle">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">Pillow</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#525252] text-[12px]">Reviewed 3 days ago</p>
    </div>
  );
}

function Meter() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0" data-name="Meter">
      <div className="bg-[#40a673] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#40a673] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#40a673] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
    </div>
  );
}

function WordCard() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="WordCard1">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative rounded-[12px] shrink-0 size-[60px]" data-name="Thumb">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgThumb} />
          </div>
          <Middle />
          <Meter />
        </div>
      </div>
    </div>
  );
}

function Middle1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative whitespace-nowrap" data-name="Middle">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">Wardrobe</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#525252] text-[12px]">Reviewed 1 week ago</p>
    </div>
  );
}

function Meter1() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0" data-name="Meter">
      <div className="bg-[#ffd600] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#ffd600] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#e5e5e5] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
    </div>
  );
}

function WordCard1() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="WordCard2">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative rounded-[12px] shrink-0 size-[60px]" data-name="Thumb">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgThumb1} />
          </div>
          <Middle1 />
          <Meter1 />
        </div>
      </div>
    </div>
  );
}

function Middle2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative text-[#cc6363] whitespace-nowrap" data-name="Middle">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[14px]">Curtain</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px]">NEEDS REVIEW TODAY</p>
    </div>
  );
}

function Meter2() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0" data-name="Meter">
      <div className="bg-[#cc6363] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#e5e5e5] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
      <div className="bg-[#e5e5e5] h-[16px] relative rounded-[2px] shrink-0 w-[6px]" data-name="Rectangle" />
    </div>
  );
}

function WordCard2() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="WordCard3">
      <div aria-hidden className="absolute border-2 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="relative rounded-[12px] shrink-0 size-[60px]" data-name="Thumb">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgThumb2} />
          </div>
          <Middle2 />
          <Meter2 />
        </div>
      </div>
    </div>
  );
}

function WordsToReviewList() {
  return (
    <div className="relative shrink-0 w-full" data-name="WordsToReviewList">
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[24px] relative size-full">
        <WordCard />
        <WordCard1 />
        <WordCard2 />
      </div>
    </div>
  );
}

function ScrollableContent1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="ScrollableContent">
      <StatusBar8 />
      <PageTitleHeader />
      <WordsToReviewList />
    </div>
  );
}

function ActionsBox() {
  return (
    <div className="relative shrink-0 w-full" data-name="ActionsBox">
      <div className="content-stretch flex items-start px-[24px] py-[12px] relative size-full">
        <div className="bg-[#4a90ff] content-stretch flex h-[56px] items-center justify-center relative rounded-[12px] shrink-0 w-[342px]" data-name="Primary Button">
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Start Review</p>
        </div>
      </div>
    </div>
  );
}

function BottomChrome() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="BottomChrome">
      <ActionsBox />
    </div>
  );
}

function Home() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="home" />;
}

function TabHome() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Home">
      <Home />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Home</p>
    </div>
  );
}

function Map() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="map" />;
}

function TabExplore() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Explore">
      <Map />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Explore</p>
    </div>
  );
}

function Workflow() {
  return <div className="bg-[#4a90ff] relative rounded-[6px] shrink-0 size-[22px]" data-name="workflow" />;
}

function TabPractice() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Practice">
      <Workflow />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">Practice</p>
    </div>
  );
}

function User() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="user" />;
}

function TabProfile() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Profile">
      <User />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabRow() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="tab-row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] py-[6px] relative size-full">
          <TabHome />
          <TabExplore />
          <TabPractice />
          <TabProfile />
        </div>
      </div>
    </div>
  );
}

function HomeIndicatorArea() {
  return (
    <div className="content-stretch flex h-[13px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="home-indicator-area">
      <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator" />
    </div>
  );
}

function ReviewMasteryReview() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="review/mastery-review">
      <div className="content-stretch flex h-[44px] items-center justify-between px-[20px] relative shrink-0 w-[390px]" data-name="iOS Status Bar">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">9:41</p>
        <StatusIcons8 />
      </div>
      <ScrollableContent1 />
      <BottomChrome />
      <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[390px]" data-name="Bottom Tab Bar">
        <TabRow />
        <HomeIndicatorArea />
      </div>
    </div>
  );
}

export default function FlowLessonExercises() {
  return (
    <div className="bg-[#e2e8f0] content-stretch flex gap-[40px] items-start p-[40px] relative size-full" data-name="Flow — Lesson & Exercises">
      <LessonWorldEntry />
      <LessonSceneDiscovery />
      <ExerciseListenRepeat />
      <ExerciseRecallMatch />
      <ExerciseContextFill />
      <ExerciseSentenceBuilder />
      <ExerciseQuickQuiz />
      <LessonCompleteResults />
      <ReviewMasteryReview />
    </div>
  );
}