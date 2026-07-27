import svgPaths from "./svg-n1h32m4r3i";
import imgMascotImage from "./ddef533e320d6bd56dd7f984308508eb3a9d2d4e.png";
import imgIllustrationPreview from "./5a83af8fd769c0a4d4fe19848405048f59c1677d.png";
import imgFlag from "./016a21d5fc2f3bf5fbf545c3a030d6e5c8330443.png";
import imgFlagEng from "./58e9c68fd7f805180d881d60341adad27ff8a07b.png";
import imgTopicImage from "./e934731cb8e0ac1e7ce19bafd775a2cd90468b6c.png";
import imgTopicImage1 from "./a45bee08c1ec0a9776cb1955d0c7c590b0b43239.png";
import imgTopicImage2 from "./594036e7d8d0809b0e9099479195e4060da62013.png";
import imgTopicImage3 from "./2bf4d00c66ec695b9c91dfd82dc3e6d3feee47b0.png";
import imgTopicImage4 from "./cfd53626b957357f28a327c9f44c1e6e1c48db46.png";
import imgTopicImage5 from "./be163166fc4abc165fc0eb15d39db027f5bb6940.png";
import imgMascotImage1 from "./1af0b5b8bf8cd3a072d6f128b20099eba250dca3.png";
import imgMascotImage2 from "./1d21ec27d82f3fa6a1cd16fe375d4034615191e1.png";
import imgWorldPreview from "./745b97e47aba4b5113f01e8d5f6e8f771bb27fd5.png";
import imgBedImg from "./bca64c80583aadd7c951cd61795a275ea4f47a1f.png";
import imgBathImg from "./bed8732059923a7b53431ce0e7038f489e831c43.png";
import imgKitchenImg from "./aeaf5c57d398002797733c2a38e5bda540787f32.png";
import imgLivingImg from "./8b22e4629aeb706ae3eee56ea4229f88b7af9b1c.png";
import imgAvatarCircle from "./f55881555ef83554c4e38c9b207dabcaee8dafbf.png";

function IosSignal() {
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

function IosWifiSignal() {
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

function IosBatteryFull() {
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
      <IosSignal />
      <IosWifiSignal />
      <IosBatteryFull />
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

function MascotContainer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[180px]" data-name="MascotContainer">
      <div className="flex-[1_0_0] min-h-px relative rounded-[99px] w-full" data-name="MascotImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[99px] size-full" src={imgMascotImage} />
      </div>
    </div>
  );
}

function IllustrationPreview() {
  return (
    <div className="h-[200px] relative rounded-[24px] shrink-0 w-full" data-name="IllustrationPreview">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgIllustrationPreview} />
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[24px] py-[40px] relative size-full">
          <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[48px] text-center whitespace-nowrap">WordPix</p>
          <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[18px] text-center whitespace-nowrap">Learn English Through Pictures</p>
          <MascotContainer />
          <IllustrationPreview />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[40px] px-[24px] relative size-full">
          <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[14px] underline whitespace-nowrap" dir="auto">
            ابدأ الآن
          </p>
        </div>
      </div>
    </div>
  );
}

function OnboardingSplashWelcome() {
  return (
    <div className="bg-[#fdecec] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="onboarding/splash-welcome">
      <StatusBar />
      <Content />
      <Footer />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
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

function Icons1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal1 />
      <IosWifiSignal1 />
      <IosBatteryFull1 />
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

function ArabicCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="ArabicCard">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-center p-[16px] relative size-full">
          <div className="h-[60px] relative rounded-[8px] shrink-0 w-[80px]" data-name="Flag">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgFlag} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold','Noto_Sans_Arabic:SemiBold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap" dir="auto" style={{ fontVariationSettings: '"wdth" 100, "wght" 600' }}>
            العربية
          </p>
          <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Arabic</p>
        </div>
      </div>
    </div>
  );
}

function EnglishCard() {
  return (
    <div className="bg-white flex-[1_0_0] min-w-px relative rounded-[20px]" data-name="EnglishCard">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-center p-[16px] relative size-full">
          <div className="h-[60px] relative rounded-[8px] shrink-0 w-[80px]" data-name="FlagEng">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgFlagEng} />
          </div>
          <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">English</p>
          <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" dir="auto">
            الإنجليزية
          </p>
        </div>
      </div>
    </div>
  );
}

function CardsRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="CardsRow">
      <ArabicCard />
      <EnglishCard />
    </div>
  );
}

function Content1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] py-[20px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#171717] text-[20px] text-center w-full">What language do you speak?</p>
        <p className="[word-break:break-word] font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[22px] text-center w-full" dir="auto">
          ما هي لغتك الأم؟
        </p>
        <CardsRow />
      </div>
    </div>
  );
}

function Footer1() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function OnboardingLanguageSelect() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="onboarding/language-select">
      <StatusBar1 />
      <Content1 />
      <Footer1 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal2() {
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

function IosWifiSignal2() {
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

function IosBatteryFull2() {
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
      <IosSignal2 />
      <IosWifiSignal2 />
      <IosBatteryFull2 />
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

function Age() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_6">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#171717] text-[28px] whitespace-nowrap">6</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ٦ سنوات
      </p>
    </div>
  );
}

function Age1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_7">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#171717] text-[28px] whitespace-nowrap">7</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ٧ سنوات
      </p>
    </div>
  );
}

function Age2() {
  return (
    <div className="bg-[#fdecec] content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_8">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[28px] whitespace-nowrap">8</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ٨ سنوات
      </p>
    </div>
  );
}

function Age3() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_9">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#171717] text-[28px] whitespace-nowrap">9</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ٩ سنوات
      </p>
    </div>
  );
}

function Age4() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_10">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#171717] text-[28px] whitespace-nowrap">10</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ١٠ سنوات
      </p>
    </div>
  );
}

function Age5() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] relative rounded-[24px] shrink-0 w-[342px]" data-name="Age_11">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Inter:Black',sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#171717] text-[28px] whitespace-nowrap">11</p>
      <p className="[word-break:break-word] font-['Inter:Medium','Noto_Sans_Arabic:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        ١١ سنة
      </p>
    </div>
  );
}

function AgeGrid() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center justify-center relative shrink-0 w-full" data-name="AgeGrid">
      <Age />
      <Age1 />
      <Age2 />
      <Age3 />
      <Age4 />
      <Age5 />
    </div>
  );
}

function Content2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] py-[20px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#171717] text-[20px] text-center w-full">How old are you?</p>
        <p className="[word-break:break-word] font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[22px] text-center w-full" dir="auto">
          كم عمرك؟
        </p>
        <AgeGrid />
      </div>
    </div>
  );
}

function Footer2() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function OnboardingAgeSelect() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col h-[844px] items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="onboarding/age-select">
      <StatusBar2 />
      <Content2 />
      <Footer2 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
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

function Icons3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal3 />
      <IosWifiSignal3 />
      <IosBatteryFull3 />
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

function LabelRow() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Animals</p>
      <div className="relative shrink-0 size-[16px]" data-name="CheckIcon">
        <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" fill="var(--fill-0, #CC6363)" id="CheckIcon" r="8" />
        </svg>
      </div>
    </div>
  );
}

function TopicAnimals() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Animals">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage} />
      </div>
      <LabelRow />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        الحيوانات
      </p>
    </div>
  );
}

function LabelRow1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Food</p>
      <div className="relative shrink-0 size-[16px]" data-name="CheckIcon">
        <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" fill="var(--fill-0, #CC6363)" id="CheckIcon" r="8" />
        </svg>
      </div>
    </div>
  );
}

function TopicFood() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Food">
      <div aria-hidden className="absolute border-3 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage1} />
      </div>
      <LabelRow1 />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        الطعام
      </p>
    </div>
  );
}

function LabelRow2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Sports</p>
    </div>
  );
}

function TopicSports() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Sports">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage2} />
      </div>
      <LabelRow2 />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        الرياضة
      </p>
    </div>
  );
}

function LabelRow3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Music</p>
    </div>
  );
}

function TopicMusic() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Music">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage3} />
      </div>
      <LabelRow3 />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        الموسيقى
      </p>
    </div>
  );
}

function LabelRow4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Science</p>
    </div>
  );
}

function TopicScience() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Science">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage4} />
      </div>
      <LabelRow4 />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        العلوم
      </p>
    </div>
  );
}

function LabelRow5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="LabelRow">
      <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Travel</p>
    </div>
  );
}

function TopicTravel() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[342px]" data-name="Topic_Travel">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[60px] relative rounded-[12px] shrink-0 w-[80px]" data-name="TopicImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgTopicImage5} />
      </div>
      <LabelRow5 />
      <p className="[word-break:break-word] font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap" dir="auto">
        السفر
      </p>
    </div>
  );
}

function InterestsGrid() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center justify-center relative shrink-0 w-full" data-name="InterestsGrid">
      <TopicAnimals />
      <TopicFood />
      <TopicSports />
      <TopicMusic />
      <TopicScience />
      <TopicTravel />
    </div>
  );
}

function Content3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[20px] items-start px-[24px] py-[20px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[#171717] text-[20px] text-center w-full">What do you like?</p>
        <p className="[word-break:break-word] font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[22px] text-center w-full" dir="auto">
          ماذا تحب؟
        </p>
        <InterestsGrid />
      </div>
    </div>
  );
}

function Footer3() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function OnboardingInterestSelect() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col h-[844px] items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="onboarding/interest-select">
      <StatusBar3 />
      <Content3 />
      <Footer3 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
    </div>
  );
}

function IosSignal4() {
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

function IosWifiSignal4() {
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

function IosBatteryFull4() {
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
      <IosSignal4 />
      <IosWifiSignal4 />
      <IosBatteryFull4 />
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

function MascotContainer1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[200px]" data-name="MascotContainer">
      <div className="flex-[1_0_0] min-h-px relative rounded-[99px] w-full" data-name="MascotImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[99px] size-full" src={imgMascotImage1} />
      </div>
    </div>
  );
}

function TextHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-center whitespace-nowrap" data-name="TextHeader">
      <p className="font-['Inter:Black',sans-serif] font-black relative shrink-0 text-[#cc6363] text-[32px]">{`You're all set!`}</p>
      <p className="font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] font-bold relative shrink-0 text-[#171717] text-[24px]" dir="auto">
        أنت جاهز تماماً!
      </p>
    </div>
  );
}

function SparklesRow() {
  return (
    <div className="h-[16px] relative shrink-0 w-[94px]" data-name="SparklesRow">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 94 16" width="94">
        <g id="SparklesRow">
          <circle cx="6" cy="6" fill="var(--fill-0, #FFD600)" id="circle-0" r="6" />
          <circle cx="32" cy="4" fill="var(--fill-0, #CC6363)" id="circle-1" r="4" />
          <circle cx="60" cy="8" fill="var(--fill-0, white)" id="circle-2" r="8" />
          <circle cx="89" cy="5" fill="var(--fill-0, #FFD600)" id="circle-3" r="5" />
        </g>
      </svg>
    </div>
  );
}

function Content4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-center px-[24px] py-[40px] relative size-full">
          <MascotContainer1 />
          <TextHeader />
          <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#525252] text-[16px] text-center w-[min-content]">{`Let's begin our journey of words and fun!`}</p>
          <SparklesRow />
        </div>
      </div>
    </div>
  );
}

function Footer4() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function OnboardingReadyCelebration() {
  return (
    <div className="bg-[#fdecec] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="onboarding/ready-celebration">
      <StatusBar4 />
      <Content4 />
      <Footer4 />
      <div className="content-stretch flex h-[13px] items-center justify-center relative shrink-0 w-[390px]" data-name="Home Indicator">
        <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator-pill" />
      </div>
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

function Icons5() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal5 />
      <IosWifiSignal5 />
      <IosBatteryFull5 />
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

function UserGreeting() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="UserGreeting">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#525252] text-[14px]">Good morning,</p>
      <p className="font-['Inter:Semibold',sans-serif] leading-[24px] relative shrink-0 text-[#171717] text-[16px]">Youssef!</p>
    </div>
  );
}

function StreakBadge() {
  return (
    <div className="bg-[#fdecec] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[12px] shrink-0" data-name="StreakBadge">
      <div className="relative shrink-0 size-[16px]" data-name="StreakIcon">
        <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" fill="var(--fill-0, #CC6363)" id="CheckIcon" r="8" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[12px] whitespace-nowrap">5 Days</p>
    </div>
  );
}

function XpBadge() {
  return (
    <div className="bg-[#ebf6ef] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[12px] shrink-0" data-name="XpBadge">
      <div className="relative shrink-0 size-[16px]" data-name="XpIcon">
        <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" fill="var(--fill-0, #40A673)" id="XpIcon" r="8" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#40a673] text-[12px] whitespace-nowrap">120 XP</p>
    </div>
  );
}

function Badges() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Badges">
      <StreakBadge />
      <XpBadge />
    </div>
  );
}

function UserBar() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="UserBar">
      <UserGreeting />
      <Badges />
    </div>
  );
}

function TitleGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="TitleGroup">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#cc6363] text-[12px] uppercase">Active World</p>
      <p className="font-['Inter:Semibold',sans-serif] leading-[24px] relative shrink-0 text-[#171717] text-[16px]">The Bedroom</p>
      <p className="font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#525252] text-[12px]" dir="auto">
        غرفة النوم
      </p>
    </div>
  );
}

function MascotContainer2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[54px]" data-name="MascotContainer">
      <div className="flex-[1_0_0] min-h-px relative rounded-[99px] w-full" data-name="MascotImage">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[99px] size-full" src={imgMascotImage2} />
      </div>
    </div>
  );
}

function CardTitleRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="CardTitleRow">
      <TitleGroup />
      <MascotContainer2 />
    </div>
  );
}

function ProgressLabels() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 text-[12px] w-full whitespace-nowrap" data-name="ProgressLabels">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#525252]">Progress</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#cc6363]">40%</p>
    </div>
  );
}

function ProgressSection() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="ProgressSection">
      <ProgressLabels />
    </div>
  );
}

function ActiveWorldBox() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="ActiveWorldBox">
      <div aria-hidden className="absolute border-2 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[16px] relative size-full">
        <CardTitleRow />
        <div className="h-[120px] relative rounded-[16px] shrink-0 w-full" data-name="WorldPreview">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgWorldPreview} />
        </div>
        <ProgressSection />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 text-[#cc6363] whitespace-nowrap" data-name="frame-0">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[14px]">Review 5 Words</p>
      <p className="font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px]" dir="auto">
        راجع ٥ كلمات سابقة
      </p>
    </div>
  );
}

function ReviewBox() {
  return (
    <div className="bg-[#fdecec] relative rounded-[20px] shrink-0 w-full" data-name="ReviewBox">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Content5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[20px] items-start px-[20px] py-[16px] relative size-full">
        <UserBar />
        <ActiveWorldBox />
        <ReviewBox />
      </div>
    </div>
  );
}

function Home() {
  return <div className="bg-[#4a90ff] relative rounded-[6px] shrink-0 size-[22px]" data-name="home" />;
}

function TabHome() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Home">
      <Home />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">Home</p>
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
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="workflow" />;
}

function TabPractice() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Practice">
      <Workflow />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Practice</p>
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

function CoreHomeDashboard() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="core/home-dashboard">
      <StatusBar5 />
      <Content5 />
      <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[390px]" data-name="Bottom Tab Bar">
        <TabRow />
        <HomeIndicatorArea />
      </div>
    </div>
  );
}

function IosSignal6() {
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

function IosWifiSignal6() {
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

function IosBatteryFull6() {
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
      <IosSignal6 />
      <IosWifiSignal6 />
      <IosBatteryFull6 />
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

function ExploreHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-bold gap-[2px] items-start not-italic relative shrink-0 w-full whitespace-nowrap" data-name="ExploreHeader">
      <p className="font-['Inter:Bold',sans-serif] leading-[30px] relative shrink-0 text-[#171717] text-[20px]">Explore Worlds</p>
      <p className="font-['Inter:Bold','Noto_Sans_Arabic:Bold',sans-serif] leading-[normal] relative shrink-0 text-[#cc6363] text-[18px]" dir="auto">
        استكشف العوالم
      </p>
    </div>
  );
}

function Level1Header() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Level1Header">
      <p className="font-['Inter:Semibold',sans-serif] leading-[20px] relative shrink-0 text-[#171717] text-[14px]">Level 1: Around the House</p>
      <p className="font-['Inter:Regular','Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#525252] text-[12px]" dir="auto">
        المستوى ١: حول المنزل
      </p>
    </div>
  );
}

function CompletedBadge() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="CompletedBadge">
      <div className="relative shrink-0 size-[14px]" data-name="badge-circle">
        <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
          <circle cx="7" cy="7" fill="var(--fill-0, #40A673)" id="badge-circle" r="7" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#40a673] text-[11px] whitespace-nowrap">Complete</p>
    </div>
  );
}

function WorldBedroom() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[168px]" data-name="WorldBedroom">
      <div aria-hidden className="absolute border-2 border-[#40a673] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="BedImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBedImg} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">The Bedroom</p>
      <CompletedBadge />
    </div>
  );
}

function WorldBathroom() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center p-[12px] relative rounded-[20px] shrink-0 w-[168px]" data-name="WorldBathroom">
      <div aria-hidden className="absolute border-2 border-[#cc6363] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="BathImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBathImg} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">The Bathroom</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#cc6363] text-[11px] whitespace-nowrap">40% Learned</p>
    </div>
  );
}

function WorldKitchen() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center opacity-60 p-[12px] relative rounded-[20px] shrink-0 w-[168px]" data-name="WorldKitchen">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="KitchenImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgKitchenImg} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap">The Kitchen</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap">Locked</p>
    </div>
  );
}

function WorldLiving() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center opacity-60 p-[12px] relative rounded-[20px] shrink-0 w-[168px]" data-name="WorldLiving">
      <div aria-hidden className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="LivingImg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgLivingImg} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap">Living Room</p>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#525252] text-[11px] whitespace-nowrap">Locked</p>
    </div>
  );
}

function WorldsGrid() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="WorldsGrid">
      <WorldBedroom />
      <WorldBathroom />
      <WorldKitchen />
      <WorldLiving />
    </div>
  );
}

function Content6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[20px] py-[16px] relative size-full">
        <ExploreHeader />
        <Level1Header />
        <WorldsGrid />
      </div>
    </div>
  );
}

function Home1() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="home" />;
}

function TabHome1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Home">
      <Home1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Home</p>
    </div>
  );
}

function Map1() {
  return <div className="bg-[#4a90ff] relative rounded-[6px] shrink-0 size-[22px]" data-name="map" />;
}

function TabExplore1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Explore">
      <Map1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">Explore</p>
    </div>
  );
}

function Workflow1() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="workflow" />;
}

function TabPractice1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Practice">
      <Workflow1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Practice</p>
    </div>
  );
}

function User1() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="user" />;
}

function TabProfile1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Profile">
      <User1 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabRow1() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="tab-row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] py-[6px] relative size-full">
          <TabHome1 />
          <TabExplore1 />
          <TabPractice1 />
          <TabProfile1 />
        </div>
      </div>
    </div>
  );
}

function HomeIndicatorArea1() {
  return (
    <div className="content-stretch flex h-[13px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="home-indicator-area">
      <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator" />
    </div>
  );
}

function CoreExploreWorlds() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="core/explore-worlds">
      <StatusBar6 />
      <Content6 />
      <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[390px]" data-name="Bottom Tab Bar">
        <TabRow1 />
        <HomeIndicatorArea1 />
      </div>
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

function Icons7() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Icons">
      <IosSignal7 />
      <IosWifiSignal7 />
      <IosBatteryFull7 />
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

function AvatarCircle() {
  return (
    <div className="relative rounded-[32px] shrink-0 size-[64px]" data-name="AvatarCircle">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[32px] size-full" src={imgAvatarCircle} />
    </div>
  );
}

function ProfileNameGroup() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 whitespace-nowrap" data-name="ProfileNameGroup">
      <p className="font-['Inter:Semibold',sans-serif] leading-[24px] relative shrink-0 text-[#171717] text-[16px]">Youssef</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#cc6363] text-[12px]">Level 3 Explorer</p>
    </div>
  );
}

function UserGroup() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="UserGroup">
      <AvatarCircle />
      <ProfileNameGroup />
    </div>
  );
}

function SettingsBtn() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="SettingsBtn">
      <svg className="absolute block inset-0 size-full" fill="none" height="40" preserveAspectRatio="none" viewBox="0 0 40 40" width="40">
        <g id="SettingsBtn">
          <rect fill="var(--fill-0, #FDECEC)" height="40" rx="20" width="40" />
          <circle cx="20" cy="20" fill="var(--fill-0, #CC6363)" id="circle-0" r="12" />
        </g>
      </svg>
    </div>
  );
}

function ProfileHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="ProfileHeader">
      <UserGroup />
      <SettingsBtn />
    </div>
  );
}

function StatsGrid() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="StatsGrid" />;
}

function BadgesRow() {
  return <div className="h-[100px] relative shrink-0 w-full" data-name="BadgesRow" />;
}

function AchievementsBlock() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="AchievementsBlock">
      <div className="content-stretch flex flex-col gap-[12px] items-start p-[16px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap">Achievements</p>
        <BadgesRow />
      </div>
    </div>
  );
}

function Content7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="content-stretch flex flex-col gap-[20px] items-start px-[20px] py-[16px] relative size-full">
        <ProfileHeader />
        <StatsGrid />
        <AchievementsBlock />
      </div>
    </div>
  );
}

function Home2() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="home" />;
}

function TabHome2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Home">
      <Home2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Home</p>
    </div>
  );
}

function Map2() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="map" />;
}

function TabExplore2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Explore">
      <Map2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Explore</p>
    </div>
  );
}

function Workflow2() {
  return <div className="bg-[#94a3b8] relative rounded-[6px] shrink-0 size-[22px]" data-name="workflow" />;
}

function TabPractice2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Practice">
      <Workflow2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap">Practice</p>
    </div>
  );
}

function User2() {
  return <div className="bg-[#4a90ff] relative rounded-[6px] shrink-0 size-[22px]" data-name="user" />;
}

function TabProfile2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[47px] items-center justify-center overflow-clip relative shrink-0 w-[64px]" data-name="tab-Profile">
      <User2 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap">Profile</p>
    </div>
  );
}

function TabRow2() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="tab-row">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] py-[6px] relative size-full">
          <TabHome2 />
          <TabExplore2 />
          <TabPractice2 />
          <TabProfile2 />
        </div>
      </div>
    </div>
  );
}

function HomeIndicatorArea2() {
  return (
    <div className="content-stretch flex h-[13px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="home-indicator-area">
      <div className="bg-[#0f172a] h-[5px] relative rounded-[9999px] shrink-0 w-[134px]" data-name="indicator" />
    </div>
  );
}

function CoreProfileStats() {
  return (
    <div className="bg-[#f7f7f7] content-stretch flex flex-col items-start justify-between min-h-[844px] overflow-clip relative rounded-[40px] shrink-0 w-[390px]" data-name="core/profile-stats">
      <StatusBar7 />
      <Content7 />
      <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-[390px]" data-name="Bottom Tab Bar">
        <TabRow2 />
        <HomeIndicatorArea2 />
      </div>
    </div>
  );
}

export default function FlowOnboardingCoreNavigation() {
  return (
    <div className="bg-[#e2e8f0] content-stretch flex gap-[40px] items-start p-[40px] relative size-full" data-name="Flow — Onboarding & Core Navigation">
      <OnboardingSplashWelcome />
      <OnboardingLanguageSelect />
      <OnboardingAgeSelect />
      <OnboardingInterestSelect />
      <OnboardingReadyCelebration />
      <CoreHomeDashboard />
      <CoreExploreWorlds />
      <CoreProfileStats />
    </div>
  );
}