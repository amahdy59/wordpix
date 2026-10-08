import fs from 'node:fs/promises';
const file = 'src/app/learning/hadith/figmaHadithContent.json';
const content = JSON.parse(await fs.readFile(file, 'utf8'));
const lesson = n => content.lessons[n - 1];
const notes = [];
function replace(n, text) {
  const l = lesson(n);
  if (l.source.translation !== text) notes.push({ lessonId:l.id, field:'source.translation', before:l.source.translation, after:text });
  l.source.translation = text;
}
const second = lesson(2);
const firstFour = second.stages['read-listen'].text.filter(l => /^[1-4]\. (?:Scene and Questioner|Islam|Iman|Ihsan): ["“]/.test(l));
const finalSection = second.source.translation.split(/\n\n/).at(-1);
if (firstFour.length === 4 && finalSection?.includes('Then inform me about the Hour')) {
  replace(2, [...firstFour, finalSection].map(l => l.replace(/^\d+\. .*?: ["“]/, '').replace(/\.\.\.["”]$/, '').replace(/["”]$/, '')).join('\n\n'));
}
for (const [n, pattern] of [[11,/^“Leave/],[13,/^"None/],[32,/^"There should/],[39,/^"Indeed, Allah/],[41,/^"None/]]) {
  const line = lesson(n).stages['read-listen'].text.find(l => pattern.test(l));
  if (line) replace(n, line.replace(/^["“]|["”]$/g, ''));
}
const first27 = lesson(27).stages['read-listen'].text.find(l => /^On the authority of al-Nawas/.test(l));
if (first27 && !lesson(27).source.translation.includes(first27)) replace(27, first27 + '\n\n' + lesson(27).source.translation);
const first40 = lesson(40).stages['read-listen'].text.find(l => /^"Be in this world/.test(l));
if (first40 && !lesson(40).source.translation.includes('stranger or a traveler')) replace(40, first40 + '\n\nIbn Umar added:\n' + lesson(40).source.translation);
replace(31, lesson(31).source.translation.replace('gainlove', 'gain love').replace('whatpossessions', 'what possessions'));
replace(17, lesson(17).source.translation.replace('On the authority of Abu Ya’la Shaddad bin Aws...', 'Shaddad ibn Aws reported:'));
if (!/["”]$/.test(lesson(19).source.translation)) replace(19, lesson(19).source.translation + '"');
replace(25, `Abu Dharr reported that some companions said to the Messenger of Allah: “Those with wealth have taken the rewards. They pray and fast as we do, and they also give charity from their extra wealth.”
He replied: “Has Allah not given you things with which to give charity? Each glorification of Allah is charity, each declaration of His greatness is charity, each expression of praise is charity, and each declaration of His oneness is charity. Encouraging good is charity, discouraging wrongdoing is charity, and sexual intimacy within marriage is charity.”
They asked whether fulfilling their desire could earn a reward. He asked: “If someone fulfilled it unlawfully, would they not be committing a sin? Likewise, fulfilling it lawfully earns a reward.”`);
// New English renderings translated from the classical Arabic, not copied from a modern translation.
replace(24, `Abu Dharr reported that the Prophet related these words from his Lord:
“My servants, I have prohibited oppression for Myself and have prohibited it among you; therefore, do not oppress each other.
My servants, you are all without guidance except those I guide. Ask Me for guidance, and I will guide you.
My servants, you are all hungry except those I feed. Ask Me for food, and I will feed you.
My servants, you are all without clothing except those I clothe. Ask Me for clothing, and I will clothe you.
My servants, you sin during the night and day, and I forgive every sin. Ask Me for forgiveness, and I will forgive you.
My servants, you cannot reach Me with harm or benefit.
My servants, if all of you, from the first to the last, humans and jinn, had the most devout heart, that would add nothing to My dominion. If all of you had the most wicked heart, that would take nothing from My dominion.
My servants, if all of you stood together and asked Me, and I gave each person what they requested, My possessions would diminish only as the sea diminishes when a needle enters it.
My servants, I count your deeds and give you their recompense. Whoever finds good should praise Allah; whoever finds otherwise should blame only themselves.”`);
replace(26, `Abu Hurayrah reported that the Messenger of Allah said:
“For every joint in a person's body, charity is due on each day the sun comes up. Bringing justice between two people is charity. Helping someone with their riding animal, by assisting them to mount or lifting their belongings onto it, is charity. A good word is charity. Each step taken towards prayer is charity. Taking something harmful off the road is charity.”`);
replace(29, `Muadh ibn Jabal said: I asked the Messenger of Allah to tell me of a deed that would admit me to Paradise and distance me from the Fire. He replied:
“You have asked about a great matter, but it is easy for someone whom Allah helps: worship Allah without associating anything with Him, establish prayer, give zakat, fast Ramadan, and make pilgrimage to the House.”
Then he said: “Let me show you the entrances to goodness: fasting is a shield, charity puts out sin as water puts out fire, and prayer during the middle of the night.” He then recited the verses beginning “Their sides leave their beds” through “what they used to do” (Qur'an 32:16–17).
He asked: “Shall I tell you the head of the matter, its pillar, and its highest point?” I said yes. He replied: “Its head is Islam, its pillar is prayer, and its highest point is jihad.”
He asked: “Shall I tell you what holds all of this together?” I said yes. Taking hold of his tongue, he said: “Keep this under control.” I asked whether we would be accountable for what we say. He replied with the Arabic expression “May your mother lose you, Muadh!” and asked whether anything throws people into the Fire on their faces—or their noses—except what their tongues have produced.`);
replace(37, `Ibn Abbas reported that the Prophet related from his Lord:
“Allah has recorded good deeds and bad deeds, and has explained them. If someone intends a good deed without doing it, Allah records one complete good deed. If they intend it and do it, Allah records ten good deeds, up to seven hundred times and still more. If someone intends a bad deed without doing it, Allah records one complete good deed. If they intend it and do it, Allah records one bad deed.”`);
// Classical Arabic is public-domain source text, checked against the cited collection.
const arabicSources = {
  24: 'عن أبي ذر الغفاري رضي الله عنه عن النبي صلى الله عليه وسلم فيما يرويه عن ربه تبارك وتعالى أنه قال: «يا عبادي، إني حرمت الظلم على نفسي، وجعلته بينكم محرما، فلا تظالموا. يا عبادي، كلكم ضال إلا من هديته، فاستهدوني أهدكم. يا عبادي، كلكم جائع إلا من أطعمته، فاستطعموني أطعمكم. يا عبادي، كلكم عار إلا من كسوته، فاستكسوني أكسكم. يا عبادي، إنكم تخطئون بالليل والنهار، وأنا أغفر الذنوب جميعا، فاستغفروني أغفر لكم. يا عبادي، إنكم لن تبلغوا ضري فتضروني، ولن تبلغوا نفعي فتنفعوني. يا عبادي، لو أن أولكم وآخركم وإنسكم وجنكم كانوا على أتقى قلب رجل واحد منكم، ما زاد ذلك في ملكي شيئا. يا عبادي، لو أن أولكم وآخركم وإنسكم وجنكم كانوا على أفجر قلب رجل واحد منكم، ما نقص ذلك من ملكي شيئا. يا عبادي، لو أن أولكم وآخركم وإنسكم وجنكم قاموا في صعيد واحد، فسألوني، فأعطيت كل واحد مسألته، ما نقص ذلك مما عندي إلا كما ينقص المخيط إذا أدخل البحر. يا عبادي، إنما هي أعمالكم أحصيها لكم، ثم أوفيكم إياها، فمن وجد خيرا فليحمد الله، ومن وجد غير ذلك فلا يلومن إلا نفسه». رواه مسلم.',
  26: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «كل سلامى من الناس عليه صدقة، كل يوم تطلع فيه الشمس: تعدل بين اثنين صدقة، وتعين الرجل في دابته فتحمله عليها أو ترفع له عليها متاعه صدقة، والكلمة الطيبة صدقة، وبكل خطوة تمشيها إلى الصلاة صدقة، وتميط الأذى عن الطريق صدقة». رواه البخاري ومسلم.',
  29: 'عن معاذ بن جبل رضي الله عنه قال: قلت يا رسول الله، أخبرني بعمل يدخلني الجنة ويباعدني من النار. قال: «لقد سألت عن عظيم، وإنه ليسير على من يسره الله عليه: تعبد الله لا تشرك به شيئا، وتقيم الصلاة، وتؤتي الزكاة، وتصوم رمضان، وتحج البيت». ثم قال: «ألا أدلك على أبواب الخير؟ الصوم جنة، والصدقة تطفئ الخطيئة كما يطفئ الماء النار، وصلاة الرجل في جوف الليل». ثم تلا: «تتجافى جنوبهم عن المضاجع» حتى بلغ «يعملون». ثم قال: «ألا أخبرك برأس الأمر وعموده وذروة سنامه؟» قلت: بلى يا رسول الله. قال: «رأس الأمر الإسلام، وعموده الصلاة، وذروة سنامه الجهاد». ثم قال: «ألا أخبرك بملاك ذلك كله؟» قلت: بلى يا نبي الله. فأخذ بلسانه وقال: «كف عليك هذا». قلت: يا نبي الله، وإنا لمؤاخذون بما نتكلم به؟ فقال: «ثكلتك أمك، وهل يكب الناس على وجوههم، أو قال على مناخرهم، إلا حصائد ألسنتهم؟» رواه الترمذي وقال: حديث حسن صحيح.',
  37: 'عن ابن عباس رضي الله عنهما عن رسول الله صلى الله عليه وسلم فيما يرويه عن ربه تبارك وتعالى قال: «إن الله كتب الحسنات والسيئات، ثم بين ذلك: فمن هم بحسنة فلم يعملها كتبها الله عنده حسنة كاملة، وإن هم بها فعملها كتبها الله عنده عشر حسنات إلى سبعمائة ضعف إلى أضعاف كثيرة. وإن هم بسيئة فلم يعملها كتبها الله عنده حسنة كاملة، وإن هم بها فعملها كتبها الله سيئة واحدة». رواه البخاري ومسلم.',
  40: 'عن ابن عمر رضي الله عنهما قال: أخذ رسول الله صلى الله عليه وسلم بمنكبي وقال: «كن في الدنيا كأنك غريب أو عابر سبيل». وكان ابن عمر رضي الله عنهما يقول: إذا أمسيت فلا تنتظر الصباح، وإذا أصبحت فلا تنتظر المساء، وخذ من صحتك لمرضك، ومن حياتك لموتك. رواه البخاري.'
};
const firstArabic27 = lesson(27).stages['read-listen'].text.find(l => /^عَنِ النَّوَّاسِ/.test(l));
if (firstArabic27 && !lesson(27).source.arabic.includes(firstArabic27)) arabicSources[27] = firstArabic27 + '\n\n' + lesson(27).source.arabic;
for (const [number, arabic] of Object.entries(arabicSources)) {
  const n = Number(number);
  if (lesson(n).source.arabic !== arabic) notes.push({lessonId:lesson(n).id,field:'source.arabic',before:lesson(n).source.arabic,after:arabic});
  lesson(n).source.arabic = arabic;
}
await fs.writeFile(file, JSON.stringify(content,null,2)+'\n');
const ledgerFile = 'docs/lesson-content-audit/hadith-source-corrections.json';
const existing = JSON.parse(await fs.readFile(ledgerFile,'utf8').catch(()=> '[]'));
for (const note of notes) {
  const prior = existing.find(item=>item.lessonId === note.lessonId && item.field === note.field);
  if (prior) prior.after = note.after; else existing.push(note);
}
await fs.writeFile(ledgerFile,JSON.stringify(existing,null,2)+'\n');
console.log(`${notes.length} source fields corrected; media references unchanged.`);
