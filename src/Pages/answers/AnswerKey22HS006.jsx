import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const answerKey = [
  // ─── UNIT I ───
  {
    unit: "Unit I", qNo: 1, marks: 2,
    questionEnglish: "Who is Paruthi Pendir?",
    questionTamil: "பருத்திப்பெண்டீர் யார்?",
    answerEnglish: "Paruthi Pendir are women workers of the Sangam period who were involved in cotton-related trades — spinning, weaving, and selling cotton garments. They represented the organized participation of women in the ancient textile industry.",
    answerTamil: "பருத்திப்பெண்டீர் என்பவர் சங்க காலத்தில் பருத்தி தொழிலில் ஈடுபட்ட பெண்கள் — நூற்பு, நெசவு மற்றும் பருத்தி ஆடைகள் விற்பனை செய்தவர்கள். இவர்கள் பண்டைய நெசவுத் தொழிலில் பெண்களின் ஒழுங்கமைந்த பங்கேற்பை பிரதிபலிக்கின்றனர்.",
    keywordsEnglish: ["Sangam period", "cotton workers", "women", "spinning", "weaving"],
    keywordsTamil: ["சங்க காலம்", "பருத்தி தொழிலாளர்", "பெண்கள்", "நூற்பு", "நெசவு"],
  },
  {
    unit: "Unit I", qNo: 2, marks: 2,
    questionEnglish: "What is 'Paa' or 'Paavottuthal'?",
    questionTamil: "பா அல்லது பாவோட்டுதல் என்றால் என்ன?",
    answerEnglish: "Paavottuthal is the process of passing the weft thread (ஊடுநூல்) through the warp threads (படுகை நூல்) during weaving using a shuttle. It is the fundamental action of the weaving process.",
    answerTamil: "பாவோட்டுதல் என்பது நெசவின்போது மாக்கு (Shuttle) மூலம் ஊடுநூலை படுகை நூல்களுக்கு இடையே கடத்தும் செயல். இதுவே நெசவின் அடிப்படை செயல்.",
    keywordsEnglish: ["weft thread", "warp thread", "shuttle", "weaving", "fundamental action"],
    keywordsTamil: ["ஊடுநூல்", "படுகை நூல்", "மாக்கு", "நெசவு", "அடிப்படை செயல்"],
  },
  {
    unit: "Unit I", qNo: 3, marks: 2,
    questionEnglish: "What are the types of weaving?",
    questionTamil: "நெசவின் வகைகள் யாவை?",
    answerEnglish: "1. Plain weave, 2. Twill weave, 3. Satin weave, 4. Jacquard weave.",
    answerTamil: "1. தட்டை நெசவு, 2. சரிவு நெசவு, 3. சாட்டின் நெசவு, 4. ஜாக்கார்ட் நெசவு.",
    keywordsEnglish: ["plain weave", "twill weave", "satin weave", "Jacquard weave"],
    keywordsTamil: ["தட்டை நெசவு", "சரிவு நெசவு", "சாட்டின் நெசவு", "ஜாக்கார்ட் நெசவு"],
  },
  {
    unit: "Unit I", qNo: 4, marks: 2,
    questionEnglish: "Write the names of any two parts of a loom.",
    questionTamil: "நெசவுத்தறியின் பகுதிகளில் ஏதேனும் இரண்டின் பெயர்களை எழுதுக.",
    answerEnglish: "1. Shuttle (மாக்கு), 2. Reed (பல் / ஆழி), 3. Heddles, 4. Beams. (Any two)",
    answerTamil: "1. மாக்கு (Shuttle), 2. பல் / ஆழி (Reed), 3. கம்பிகள் (Heddles), 4. கற்றை (Beam). (ஏதேனும் இரண்டு)",
    keywordsEnglish: ["shuttle", "reed", "heddles", "beams", "loom"],
    keywordsTamil: ["மாக்கு", "பல்", "கம்பிகள்", "கற்றை", "தறி"],
  },
  {
    unit: "Unit I", qNo: 5, marks: 2,
    questionEnglish: "How were the woven garments sold during the Sangam period?",
    questionTamil: "சங்க காலத்தில் நெசவு செய்த ஆடைகளை எவ்வாறு விற்றனர்?",
    answerEnglish: "Woven garments were sold at markets called Angadi (அங்காடி). They were transported via carts and ships, traded through the barter system, and fine muslin was exported to Rome and Arabia through ports like Puhar and Musiri.",
    answerTamil: "நெசவு ஆடைகள் 'அங்காடி' எனப்படும் சந்தைகளில் விற்கப்பட்டன. வண்டி மற்றும் கப்பல்கள் மூலம் கொண்டு செல்லப்பட்டன; பண்டமாற்று முறையில் வணிகம் நடந்தது; புகார், முசிறி துறைமுகங்கள் வழியாக ரோம் மற்றும் அரேபியாவுக்கு ஏற்றுமதி செய்யப்பட்டன.",
    keywordsEnglish: ["Angadi", "barter", "Puhar", "Musiri", "export", "Rome"],
    keywordsTamil: ["அங்காடி", "பண்டமாற்று", "புகார்", "முசிறி", "ஏற்றுமதி"],
  },
  {
    unit: "Unit I", qNo: 6, marks: 2,
    questionEnglish: "Where were dye vats discovered?",
    questionTamil: "எங்கு சாயத்தொட்டிகள் கண்டெடுக்கப்பட்டன?",
    answerEnglish: "Dye vats were discovered at Uraiyur (Tiruchirappalli) and Kaveripoompattinam (Puhar). They confirm that organized commercial dyeing was practised in ancient Tamil Nadu.",
    answerTamil: "சாயத்தொட்டிகள் உறையூர் (திருச்சிராப்பள்ளி) மற்றும் காவேரிப்பூம்பட்டினம் (புகார்) ஆகிய இடங்களில் கண்டெடுக்கப்பட்டன. இவை ஒழுங்கமைந்த வணிக சாயமிடல் நடைபெற்றது என்பதை உறுதிப்படுத்துகின்றன.",
    keywordsEnglish: ["Uraiyur", "Kaveripoompattinam", "dye vats", "dyeing"],
    keywordsTamil: ["உறையூர்", "காவேரிப்பூம்பட்டினம்", "சாயத்தொட்டி", "சாயமிடல்"],
  },
  {
    unit: "Unit I", qNo: 7, marks: 2,
    questionEnglish: "Which type of pottery was popular in Madurai?",
    questionTamil: "மதுரையில் எந்த மட்பாண்டங்கள் சிறந்தவையாகக் கருதப்படுகின்றது?",
    answerEnglish: "Black and Red Ware (BRW) pottery was popular in Madurai. It has a black interior and upper exterior, red lower exterior, created using the inverted firing technique. It is associated with the Iron Age and early historic Tamil culture.",
    answerTamil: "மதுரையில் கருப்பு சிவப்பு மட்பாண்டங்கள் (Black and Red Ware – BRW) பிரபலமாக இருந்தன. உட்புறமும் மேல் வெளிப்புறமும் கருப்பாகவும், கீழ் வெளிப்புறம் சிவப்பாகவும் இருக்கும். தலைகீழ் சுடல் முறையால் தயாரிக்கப்பட்டன.",
    keywordsEnglish: ["Black and Red Ware", "Madurai", "Iron Age", "inverted firing"],
    keywordsTamil: ["கருப்பு சிவப்பு மட்பாண்டம்", "மதுரை", "இரும்பு காலம்", "தலைகீழ் சுடல்"],
  },
  {
    unit: "Unit I", qNo: 8, marks: 2,
    questionEnglish: "What is the specialty of Velloor Karigiri pottery?",
    questionTamil: "வேலூர் கரிகிரி மட்பாண்டங்களின் சிறப்பு என்ன?",
    answerEnglish: "Velloor Karigiri pottery (near Vellore, Tamil Nadu) is known for its fine black polished surface with thin walls, achieved by burnishing (rubbing with a smooth stone) before firing. It represents advanced ancient Tamil pottery craftsmanship.",
    answerTamil: "வேலூர் அருகே உள்ள கரிகிரி மட்பாண்டங்கள் நேர்த்தியான கருப்பு பளபளப்பான மேற்பரப்பும் மெல்லிய சுவரும் கொண்டவை. சுடுவதற்கு முன் மென்மையான கல்லால் மெருகூட்டுவதன் (Burnishing) மூலம் இந்த பளபளப்பு உண்டாக்கப்படுகிறது.",
    keywordsEnglish: ["Velloor", "Karigiri", "black polished", "burnishing", "thin walls"],
    keywordsTamil: ["வேலூர்", "கரிகிரி", "கருப்பு பளபளப்பு", "மெருகூட்டல்", "மெல்லிய சுவர்"],
  },
  {
    unit: "Unit I", qNo: 9, marks: 2,
    questionEnglish: "What are the two divisions of pottery?",
    questionTamil: "மட்பாண்டங்களின் இரு பிரிவுகள் என்ன?",
    answerEnglish: "1. Glazed pottery (பளபளப்பான மட்பாண்டம்) — has a glass-like coating; waterproof and decorative.\n2. Unglazed pottery (மெருகூட்டப்படாத மட்பாண்டம்) — no coating; porous; used to store cool water.",
    answerTamil: "1. மெருகூட்டப்பட்ட மட்பாண்டம் (Glazed) — கண்ணாடி போன்ற பூச்சு; நீர் ஊடுருவாது.\n2. மெருகூட்டப்படாத மட்பாண்டம் (Unglazed) — பூச்சு இல்லாதது; துளைகள் உடையது; குளிர்ந்த நீர் சேமிக்கப் பயன்படும்.",
    keywordsEnglish: ["glazed pottery", "unglazed pottery", "two divisions"],
    keywordsTamil: ["மெருகூட்டப்பட்ட", "மெருகூட்டப்படாத", "இரு பிரிவுகள்"],
  },
  {
    unit: "Unit I", qNo: 10, marks: 2,
    questionEnglish: "What is meant by craft work on pottery?",
    questionTamil: "மண்பாண்டங்களில் நுண்கலைப் படைப்பு என்றால் என்ன?",
    answerEnglish: "Craft work on pottery refers to artistic decoration applied on clay pots — including incised designs, painted motifs, impressed patterns, and relief work. These express the cultural, religious, and aesthetic values of the society.",
    answerTamil: "மண்பாண்டங்களில் நுண்கலைப் படைப்பு என்பது கீறல் வடிவங்கள், வர்ண ஓவியம், நிவர வேலைப்பாடு போன்ற கலைகூறு அலங்கரண வேலைப்பாடுகளை குறிக்கும். இவை சமூகத்தின் கலாச்சார, மத மதிப்புகளை வெளிப்படுத்துகின்றன.",
    keywordsEnglish: ["incised designs", "painted motifs", "relief work", "decoration"],
    keywordsTamil: ["கீறல் வடிவங்கள்", "வர்ண ஓவியம்", "நிவர வேலை", "அலங்காரம்"],
  },
  {
    unit: "Unit I", qNo: 11, marks: 2,
    questionEnglish: "What are the uses of pottery in educational art?",
    questionTamil: "கல்வியில் கலையில் மண்பாண்டங்களின் பயன்கள் யாவை?",
    answerEnglish: "1. Develops creativity and fine motor skills in students.\n2. Teaches history and archaeology through ancient pottery analysis.\n3. Promotes traditional crafts as cultural heritage education.\n4. Serves as a medium for artistic expression.",
    answerTamil: "1. மாணவர்களின் படைப்பாற்றலை வளர்க்கிறது.\n2. தொல்லியல் வழியாக வரலாறு கற்பிக்கிறது.\n3. கலாச்சார கல்வியில் பாரம்பரிய கைவினைகளை மேம்படுத்துகிறது.\n4. கலைப் பாடங்களில் படைப்பாக்க ஊடகமாக செயல்படுகிறது.",
    keywordsEnglish: ["creativity", "archaeology", "cultural heritage", "art medium"],
    keywordsTamil: ["படைப்பாற்றல்", "தொல்லியல்", "கலாச்சார பாரம்பரியம்", "கலை ஊடகம்"],
  },
  {
    unit: "Unit I", qNo: 12, marks: 2,
    questionEnglish: "What are the uses of pottery in medical science?",
    questionTamil: "மருத்துவக் கலையில் மட்பாண்டங்களின் பயன்கள் யாவை?",
    answerEnglish: "1. Clay pots keep water cool and prevent bacterial growth.\n2. Used to store herbal medicines and oils.\n3. Pottery residue analysis identifies ancient diets and diseases.\n4. Clay therapy (pelotherapy) is used for skin treatments.",
    answerTamil: "1. களிமண் பாத்திரங்கள் நீரை குளிர்ச்சியாக வைத்திருக்கும்.\n2. மூலிகை மருந்துகள் மற்றும் எண்ணெய்களை சேமிக்கப் பயன்படும்.\n3. மட்பாண்ட எச்சம் பகுப்பாய்வு பண்டைய உணவை அறியவைக்கிறது.\n4. களிமண் சிகிச்சை தோல் நோய்களுக்கு பயன்படுகிறது.",
    keywordsEnglish: ["cool water", "herbal medicine", "residue analysis", "clay therapy"],
    keywordsTamil: ["குளிர்ந்த நீர்", "மூலிகை மருந்து", "எச்சம் பகுப்பாய்வு", "களிமண் சிகிச்சை"],
  },
  {
    unit: "Unit I", qNo: 13, marks: 2,
    questionEnglish: "What materials are found in black and red ware?",
    questionTamil: "கருப்பு சிவப்பு மட்பாண்டங்களில் காணப்படும் பொருட்கள் யாவை?",
    answerEnglish: "1. Iron weapons (swords, spearheads), 2. Iron tools (knives, sickles), 3. Beads (carnelian, glass, gold), 4. Punch-marked coins, 5. Grains (paddy, millet), 6. Animal bones.",
    answerTamil: "1. இரும்பு ஆயுதங்கள் (வாள், ஈட்டி), 2. இரும்பு கருவிகள் (கத்தி, அரிவாள்), 3. மணிகள் (கோமேதகம், கண்ணாடி, தங்கம்), 4. குத்துமுத்திரை நாணயங்கள், 5. தானியங்கள் (நெல், தினை), 6. விலங்கு எலும்புகள்.",
    keywordsEnglish: ["iron weapons", "beads", "coins", "grains", "burial urns"],
    keywordsTamil: ["இரும்பு ஆயுதங்கள்", "மணிகள்", "நாணயங்கள்", "தானியங்கள்", "இடுகாட்டு கலசம்"],
  },
  {
    unit: "Unit I", qNo: 14, marks: 2,
    questionEnglish: "What symbols are found on pottery?",
    questionTamil: "மட்பாண்டங்களில் காணப்படும் குறியீடுகள் யாவை?",
    answerEnglish: "1. Swastika (ஸ்வஸ்திக), 2. Fish (மீன் — Pandya emblem), 3. Geometric patterns (circles, lines, dots), 4. Graffiti marks, 5. Sun and star motifs.",
    answerTamil: "1. ஸ்வஸ்திக, 2. மீன் சின்னம் (பாண்டியர் சின்னம்), 3. வடிவியல் வடிவங்கள் (வட்டங்கள், கோடுகள், புள்ளிகள்), 4. கீறல் குறிகள், 5. சூரியன் மற்றும் நட்சத்திர வடிவங்கள்.",
    keywordsEnglish: ["Swastika", "fish symbol", "geometric patterns", "graffiti marks", "sun motif"],
    keywordsTamil: ["ஸ்வஸ்திக", "மீன் சின்னம்", "வடிவியல் வடிவங்கள்", "கீறல் குறிகள்"],
  },
  {
    unit: "Unit I", qNo: 15, marks: 2,
    questionEnglish: "In which part of Tamil Nadu were pots with the Swastika symbol found?",
    questionTamil: "தமிழகத்தில் ஸ்வஸ்திக் குறியீடு உள்ள மண்பாண்டங்கள் எங்கு காணப்பட்டன?",
    answerEnglish: "Pots with Swastika symbols were found at Adichanallur (Tirunelveli district) and Kodumanal (Erode district) — major Iron Age burial sites in Tamil Nadu.",
    answerTamil: "ஸ்வஸ்திக குறியீடு உள்ள மண்பாண்டங்கள் ஆதிச்சநல்லூர் (திருநெல்வேலி மாவட்டம்) மற்றும் கோடுமணல் (ஈரோடு மாவட்டம்) ஆகிய முக்கிய இரும்பு கால இடுகாட்டு தளங்களில் கண்டெடுக்கப்பட்டன.",
    keywordsEnglish: ["Adichanallur", "Kodumanal", "Swastika", "Tirunelveli", "Erode"],
    keywordsTamil: ["ஆதிச்சநல்லூர்", "கோடுமணல்", "ஸ்வஸ்திக", "திருநெல்வேலி", "ஈரோடு"],
  },
  {
    unit: "Unit I", qNo: 16, marks: 2,
    questionEnglish: "During which period did people use symbols to express their thoughts?",
    questionTamil: "எக்காலத்து மக்கள் தங்கள் எண்ணங்களை வெளிப்படுத்த குறியீடுகளைப் பயன்படுத்தினர்?",
    answerEnglish: "People used symbols from prehistoric times (Neolithic and Chalcolithic periods). In Tamil Nadu, symbols are found from the Iron Age (c. 1000–300 BCE) and continued through the Sangam period. These graffiti marks represent early written communication before the formal Tamil script.",
    answerTamil: "வரலாற்றுக்கு முந்தைய காலம் (கற்காலம்) முதலே மக்கள் குறியீடுகளை பயன்படுத்தினர். தமிழகத்தில் இரும்பு காலம் (கி.மு. 1000–300) முதல் சங்க காலம் வரை குறியீடுகள் காணப்படுகின்றன. இந்த கீறல் குறிகள் முறையான தமிழ் எழுத்துக்கு முந்தைய தொடர்பாட்டை காட்டுகின்றன.",
    keywordsEnglish: ["prehistoric", "Iron Age", "Sangam period", "graffiti marks", "proto-writing"],
    keywordsTamil: ["வரலாற்றுக்கு முந்தைய", "இரும்பு காலம்", "சங்க காலம்", "கீறல் குறிகள்"],
  },

  // ─── UNIT I – 16 MARK ───
  {
    unit: "Unit I", qNo: 17, marks: 16,
    questionEnglish: "How was the weaving industry during the Sangam period? Explain in detail the various stages involved in making clothing.",
    questionTamil: "சங்க காலத்தில் நெசவுத் தொழில் எப்படி இருந்தது? அவற்றில் ஆடைகள் தயாரிப்பதில் உள்ள பல்வேறு படிநிலைகளை விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
The Sangam period (300 BCE – 300 CE) witnessed a highly developed textile industry. Ancient Tamil literature, particularly Purananuru, Akananuru, and Pattinappalai, provides vivid accounts of weaving as a major economic activity.

1. Raw Material Collection:
• Cotton was the primary raw material (paruthi). Silk threads (பட்டு) were also used.
• Paruthi Pendir (women cotton workers) handled cotton collection and preparation.
• Fibres were cleaned, carded, and combed to remove impurities.

2. Spinning (நூற்பு):
• Cotton fibres were drawn and twisted into yarn using hand-held spindles (திரகை).
• Women predominantly performed spinning at home.
• Different grades of yarn were produced for coarse and fine fabrics.

3. Dyeing (சாயமிடல்):
• Natural dyes from plants (indigo, turmeric, madder) and minerals were used.
• Dye vats (சாயத்தொட்டி) discovered at Uraiyur confirm commercial dyeing.
• Yarns were dyed before weaving (yarn dyeing) or after (piece dyeing).

4. Warping (படுகை நூல் அமைத்தல்):
• Warp threads were stretched and arranged on the loom in parallel order.
• Length and density determined the fabric's strength and texture.

5. Weaving on the Loom (நெசவு):
• The loom (தறி) was the central device. Parts included shuttle (மாக்கு), reed (பல்), and heddles.
• Paa (Paavottuthal) – passing the weft through the warp – was the fundamental action.
• Skilled weavers (நெசவாளர்) created plain, striped, and patterned fabrics.

6. Types of Fabrics Produced:
• Fine muslin (கூலம்) – so thin it could be folded inside a walnut shell, famous in exports.
• Silk fabrics (பட்டாடை) for royalty.
• Cotton garments (பருத்தியாடை) for common use.

7. Finishing:
• Cloth was washed, bleached, and sometimes starched.
• Final inspection and folding for market sale.

8. Trade and Export:
• Woven goods sold in Angadi markets and seaport towns.
• Fine cloth exported to Rome, Arabia, and Southeast Asia through ports like Puhar and Musiri.
• Barter system and coin-based trade both practised.

9. Artisan Communities:
• Weavers (நெசவாளர்), dyers (சாயக்காரர்), and merchants (வணிகர்) formed interconnected occupational groups.
• Royal patronage encouraged high-quality textile production.

Conclusion:
The Sangam period weaving industry was sophisticated, well-organized, and internationally connected. The evidence from literature and archaeology reveals that ancient Tamils were pioneers in textile production, with methods that combined artistry, technical skill, and commercial enterprise.

Keywords: Sangam, paruthi, spinning, dyeing, loom, muslin, export, Angadi, Uraiyur`,
    answerTamil: `அறிமுகம்:
சங்க காலம் (கி.மு. 300 – கி.பி. 300) மிகவும் வளர்ச்சியடைந்த நெசவுத் தொழிலை கொண்டிருந்தது. புறநானூறு, அகநானூறு, பட்டினப்பாலை போன்ற சங்க இலக்கியங்கள் நெசவை முக்கிய பொருளாதார செயல்பாடாக விவரிக்கின்றன.

1. மூலப்பொருள் சேகரிப்பு:
• பருத்தி முக்கிய மூலப்பொருள். பட்டு நூலும் பயன்படுத்தப்பட்டது.
• பருத்திப்பெண்டீர் பருத்தி சேகரித்து தயாரிப்பில் ஈடுபட்டனர்.
• நார்களை சுத்தப்படுத்தி, சீவி, சீப்பால் நேர்படுத்தினர்.

2. நூற்பு (Spinning):
• கையில் பிடிக்கும் தறிகை (திரகை) மூலம் நார்களை திரித்து நூல் ஆக்கினர்.
• பெண்கள் வீட்டில் நூல் நூற்பனர்.
• கோரைத் துணிக்கும் நேர்த்தியான துணிக்கும் வெவ்வேறு தரத்தில் நூல் தயாரிக்கப்பட்டது.

3. சாயமிடல் (Dyeing):
• தாவர இயற்கை சாயங்கள் (இண்டிகோ, மஞ்சள், மஞ்சிட்டா) மற்றும் தாதுக்கள் பயன்படுத்தப்பட்டன.
• உறையூரில் கண்டெடுக்கப்பட்ட சாயத்தொட்டிகள் வணிக அளவிலான சாயமிடலை உறுதிப்படுத்துகின்றன.

4. படுகை நூல் அமைத்தல் (Warping):
• படுகை நூல்களை தறியில் நேர்க்கோடாக வரிசையில் நிரப்பினர்.
• நீளம் மற்றும் அடர்த்தி துணியின் உறுதி மற்றும் தன்மையை தீர்மானிக்கும்.

5. நெசவு (Weaving):
• தறி (Loom) மூல கருவி. மாக்கு, பல், கம்பிகள் அடங்கும்.
• பாவோட்டுதல் – ஊடுநூலை படுகை நூல்களுக்கு இடையே கடத்தும் செயல்.
• தட்டை, கோடு, வடிவ நெசவு முறைகளில் துணி தயாரிக்கப்பட்டது.

6. தயாரிக்கப்பட்ட துணிகளின் வகை:
• கூலம் (நேர்த்தியான மெல்லிய துணி) – ஏற்றுமதிக்கு பிரபலமானது.
• பட்டாடை – அரசவை பயன்பாட்டிற்காக.
• பருத்தியாடை – பொது மக்களுக்காக.

7. இறுதி செய்முறை:
• துணி கழுவி, வெளுத்து, சில சமயம் கஞ்சி போடப்பட்டது.
• சந்தை விற்பனைக்காக அடிக்கல் போட்டு மடிக்கப்பட்டது.

8. வணிகம் மற்றும் ஏற்றுமதி:
• அங்காடி சந்தைகளிலும் துறைமுக நகரங்களிலும் துணிகள் விற்கப்பட்டன.
• புகார், முசிறி போன்ற துறைமுகங்கள் வழியே ரோம், அரேபியா ஏற்றுமதி.
• பண்டமாற்று மற்றும் நாணய வணிகம் இரண்டும் நடைமுறையில் இருந்தன.

9. கைவினை சமூகங்கள்:
• நெசவாளர், சாயக்காரர், வணிகர் ஆகியோர் ஒன்றோடொன்று தொடர்புடைய தொழில் குழுக்களை உருவாக்கினர்.

முடிவுரை:
சங்க கால நெசவுத் தொழில் நுட்பமான, நன்கு ஒழுங்கமைந்த மற்றும் சர்வதேச அளவில் தொடர்புடைய ஒன்றாக இருந்தது. பண்டைய தமிழர்கள் ஆடை உற்பத்தியில் முன்னோடிகளாக விளங்கினர்.

முக்கிய சொற்கள்: சங்க காலம், பருத்தி, நூற்பு, சாயமிடல், தறி, கூலம், ஏற்றுமதி`,
    keywordsEnglish: ["Sangam", "weaving", "paruthi", "spinning", "dyeing", "loom", "muslin", "export", "Angadi"],
    keywordsTamil: ["சங்க காலம்", "நெசவு", "பருத்தி", "நூற்பு", "சாயமிடல்", "தறி", "கூலம்", "ஏற்றுமதி"],
  },
  {
    unit: "Unit I", qNo: 18, marks: 16,
    questionEnglish: "What are glossy and unpolished pottery? Explain in detail the process of making pottery.",
    questionTamil: "பளபளப்பான மற்றும் மெருகூட்டப்படாத மட்பாண்டங்கள் என்றால் என்ன? மட்பாண்டங்கள் செய்யும் முறையை விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
Pottery is one of the oldest craft technologies of humankind. In ancient Tamil Nadu, pottery was a highly skilled art form practiced by the Kuyinar community (குயிஞர்). Pottery is broadly classified as glazed (பளபளப்பான) and unglazed (மெருகூட்டப்படாத).

Glossy (Glazed) Pottery:
• Has a glass-like vitreous surface coating applied over the clay body.
• Made by applying mineral silicates (feldspar, quartz, metal oxides) to the clay surface before or after firing.
• Waterproof, hygienic, and decorative.
• Examples: Chinese porcelain, Islamic blue-and-white ware.
• Used for storage of liquids, serving food, and display.

Unpolished (Unglazed) Pottery:
• No coating; natural rough or matte clay surface.
• Porous in nature, allowing slight evaporation — ideal for storing cool drinking water.
• Simpler manufacturing process, lower cost.
• Examples: Traditional Tamil clay pots (மண் கலயம்), terracotta figurines.

Process of Making Pottery:

Step 1 – Clay Preparation (களிமண் தயாரிப்பு):
• Clay is dug from riverbeds or pits. Impurities like pebbles and organic matter are removed.
• Clay is soaked in water, kneaded thoroughly to achieve uniform consistency — called pugging.
• Grog (fired clay particles) may be added for strength.

Step 2 – Shaping (வடிவமைத்தல்):
Methods include:
• Hand-building: pinching, coiling (serpentine clay ropes built up), slabbing.
• Potter's wheel (குயவர் சக்கரம்): most common. Clay is centered on a spinning wheel and shaped by hand pressure — called throwing.
• Mould: clay pressed into pre-made forms.

Step 3 – Drying (காய வைத்தல்):
• Shaped pots are left to dry slowly in shade.
• Rapid drying causes cracking; controlled drying is essential.
• When leather-hard (semi-dry), surface can be carved, incised, or decorated.

Step 4 – Decoration (அலங்காரம்):
• Incised lines, painted designs, applied clay motifs.
• Slip (watered clay) applied for smooth surface or colour contrast.
• Burnishing (மெருகூட்டல்): rubbing with a smooth stone to create a shiny surface — used in Velloor Karigiri pottery.

Step 5 – Firing (சுடுதல்):
• Open firing: pots stacked in an open bonfire with wood or dung fuel; used for simple earthenware.
• Kiln firing (சூளை): closed chamber kiln provides controlled temperature (800°C–1200°C).
• Inverted firing method produces Black and Red Ware.
• Higher temperature → harder, less porous pots (stoneware, porcelain).

Step 6 – Glazing (optional):
• Mineral glaze applied; pot re-fired to fuse glaze to surface.
• Creates waterproof and decorative finish.

Step 7 – Quality Check and Sale:
• Finished pots inspected for cracks.
• Sold at weekly markets (சந்தை) and annual fairs.

Types of Traditional Tamil Pottery:
• Black and Red Ware (BRW), Megalithic pottery, Terracotta figurines, Red ware.

Conclusion:
Pottery making is a multi-stage process requiring knowledge of materials, craftsmanship, and firing technology. Ancient Tamil potters mastered these techniques and produced wares of both utility and artistic excellence.

Keywords: clay preparation, throwing, kiln, burnishing, glazed, unglazed, Black and Red Ware`,
    answerTamil: `அறிமுகம்:
மட்கலை மனிதகுலத்தின் மிகவும் பழமையான கைவினை தொழில்நுட்பங்களில் ஒன்றாகும். பண்டைய தமிழகத்தில் குயிஞர் சமூகத்தினர் இதை கலையாக பயிற்சி செய்தனர். மட்பாண்டங்கள் முக்கியமாக பளபளப்பான (Glazed) மற்றும் மெருகூட்டப்படாத (Unglazed) என இரண்டாக பிரிக்கப்படுகின்றன.

பளபளப்பான (Glazed) மட்பாண்டம்:
• கண்ணாடி போன்ற பூச்சு கொண்ட மட்பாண்டம்.
• சிலிக்கேட் கனிமங்கள், உலோக ஆக்சைடுகள் மேற்பரப்பில் பூசி சுடப்படுகிறது.
• நீர் ஊடுருவாது, சுகாதாரமானது, அலங்காரமானது.
• திரவங்களை சேமிக்க, உணவு பரிமாற பயன்படுகிறது.

மெருகூட்டப்படாத (Unglazed) மட்பாண்டம்:
• எந்த பூச்சும் இல்லாத இயற்கை மட்பாண்டம்.
• துளைகள் கொண்டது, நீர் ஆவியாவதால் குளிர்ச்சியை பராமரிக்கும்.
• எளிய தயாரிப்பு முறை, குறைந்த செலவு.
• பாரம்பரிய மண் கலயம், மண் சிலைகள் எடுத்துக்காட்டுகள்.

மட்பாண்டம் செய்யும் முறை:

படிநிலை 1 – களிமண் தயாரிப்பு:
• ஆற்றுப்படுகை அல்லது குழிகளிலிருந்து களிமண் எடுக்கப்படுகிறது.
• கற்கள், கரிம பொருட்கள் நீக்கப்படும்.
• நீரில் ஊற வைத்து நன்கு பிசைந்து சீரான நிலைத்தன்மை அடைகிறது.

படிநிலை 2 – வடிவமைத்தல்:
• கை முறை: சிட்டிக்கு அழுத்துதல், சுருள் உருட்டல், தட்டு முறை.
• குயவர் சக்கரம்: சுழலும் சக்கரத்தில் மண்ணை மையத்தில் வைத்து கை அழுத்தத்தால் வடிவமைக்கும் முறை (Throwing).
• அச்சு முறை: முன்தயாரிக்கப்பட்ட அச்சில் மண் அழுத்துதல்.

படிநிலை 3 – காய வைத்தல்:
• நிழலில் மெதுவாக காய வைக்கப்படும்.
• விரைவாக காய்வது வெடிப்பை ஏற்படுத்தும்.
• அரை காய்ந்த நிலையில் கீறல் வடிவங்கள் செய்யலாம்.

படிநிலை 4 – அலங்காரம்:
• கீறல் கோடுகள், வர்ண ஓவியம், மண் அலங்கார உருவங்கள்.
• மெருகூட்டல் (Burnishing): மென்மையான கல்லால் தேய்த்து பளபளப்பான மேற்பரப்பு உருவாக்குதல்.

படிநிலை 5 – சுடுதல்:
• திறந்த வெளி சுடல்: திடல்/மேட்டில் எரிக்கப்படும்.
• சூளை: மூடிய சூளையில் கட்டுப்படுத்தப்பட்ட வெப்பநிலையில் (800°C–1200°C) சுடப்படும்.
• தலைகீழ் சுடல் முறையில் கருப்பு சிவப்பு மட்பாண்டம் தயாரிக்கப்படும்.

படிநிலை 6 – மெருகூட்டப்பட்ட பூச்சு (விருப்பப்படி):
• கனிம பூச்சு தடவி மீண்டும் சுட்டு நீர்கடத்தாத மேற்பரப்பு உருவாக்கப்படும்.

முடிவுரை:
மட்கலை செய்வது பல படிநிலைகளை கொண்ட செயல்முறையாகும். பண்டைய தமிழ் குயவர்கள் இந்த கலையில் தேர்ச்சி பெற்று பயன்பாட்டு மற்றும் கலைகூறு நிறைந்த பாத்திரங்கள் உருவாக்கினர்.

முக்கிய சொற்கள்: களிமண் தயாரிப்பு, சக்கர சுட்டல், சூளை, மெருகூட்டல், கருப்பு சிவப்பு மட்பாண்டம்`,
    keywordsEnglish: ["clay preparation", "potter's wheel", "kiln", "burnishing", "glazed", "unglazed", "Black and Red Ware", "firing"],
    keywordsTamil: ["களிமண் தயாரிப்பு", "குயவர் சக்கரம்", "சூளை", "மெருகூட்டல்", "கருப்பு சிவப்பு"],
  },

  {
    unit: "Unit I", qNo: 19, marks: 16,
    questionEnglish: "Explain in detail about black and red ware.",
    questionTamil: "கருப்பு மற்றும் சிவப்பு மட்பாண்டங்கள் பற்றி விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
Black and Red Ware (BRW) is one of the most distinctive and archaeologically significant pottery traditions of ancient South Asia. In Tamil Nadu, it is closely associated with the Iron Age (c. 1000–300 BCE) and early historical Sangam period, revealing crucial information about ancient society, economy, and burial customs.

Definition and Appearance:
• Black and Red Ware pots have a unique dual-tone appearance: the interior and upper exterior surface are jet black, while the lower exterior is brick red.
• The distinctive coloration is achieved through an inverted firing technique (தலைகீழ் சுடல் முறை).

Manufacturing Process:
• Clay is shaped on a potter's wheel and allowed to dry.
• The pot is then inverted (placed upside down) in the kiln.
• During firing, the upper portion (which is inverted and closer to the reducing atmosphere) turns black, while the lower portion (exposed to oxidizing atmosphere) turns red.
• Temperature control during kiln firing was critical to achieving this dual-tone effect.

Archaeological Discovery Sites in Tamil Nadu:
• Adichanallur (Tirunelveli) – One of the richest BRW burial sites; thousands of burial urns excavated.
• Uraiyur (Tiruchirappalli) – Major production centre; dye vats also found nearby.
• Kodumanal (Erode) – Yielded BRW along with iron tools, beads, and inscribed pottery.
• Porunthal (Palani, Dindigul) – BRW associated with paddy grains and iron artefacts.
• Arikamedu (Puducherry) – BRW found alongside Roman amphorae, confirming trade links.
• Perur, Kudiyiruppu, Mangudi – Additional excavated sites.

Contents Found Inside BRW:
1. Iron weapons – swords, spearheads, arrowheads
2. Iron tools – knives, sickles, agricultural implements
3. Ornaments – gold foil, carnelian beads, glass beads
4. Coins – punch-marked coins
5. Grains – paddy, millet (food offerings)
6. Animal bones – ritual burial food offerings

Funerary Use (Burial Urns):
• BRW pots were predominantly used as burial urns (கொடு, முதுமக்கள் தாழி).
• The dead were placed in large BRW urns, often in foetal position.
• The burial goods placed inside reveal social status, occupation, and trade connections of the deceased.
• The urn burial tradition reflects belief in afterlife among Iron Age Tamils.

Symbols and Inscriptions on BRW:
• Graffiti marks (கீறல் குறிகள்) — incised before or after firing.
• Fish symbol (மீன்) — associated with Pandya dynasty.
• Swastika (ஸ்வஸ்திக) — auspicious symbol.
• Sun, trident, and star motifs — religious significance.
• These early marks may represent proto-writing or ownership symbols.

Historical Significance:
1. BRW confirms that Iron Age Tamils had sophisticated kiln technology.
2. The burial goods reveal organized society with trade networks (Roman, Southeast Asian connections).
3. Graffiti marks represent one of the earliest attempts at written communication in Tamil Nadu.
4. The presence of paddy and millet confirms settled agricultural society.
5. Iron implements indicate technological advancement in metallurgy.

Chronology:
• Earliest BRW in Tamil Nadu: c. 1000 BCE (Iron Age).
• Continues into early historic period: c. 300 BCE – 300 CE (Sangam period).
• Overlaps with the Megalithic culture in peninsular India.

BRW and Literature:
• Sangam texts like Purananuru describe the use of large earthen urns (தாழி) for burial.
• Akananuru mentions funeral rituals where pots were placed at burial sites.

Conclusion:
Black and Red Ware is not merely a pottery type — it is a cultural marker of Iron Age Tamil civilization. Its unique firing technology, widespread distribution, and the valuable artefacts found within have made it indispensable for understanding the social, religious, and economic life of ancient Tamils.

Keywords: BRW, inverted firing, burial urn, Adichanallur, Iron Age, graffiti marks, Kodumanal, Pandya`,
    answerTamil: `அறிமுகம்:
கருப்பு சிவப்பு மட்பாண்டம் (Black and Red Ware – BRW) தென்னிந்திய தொல்லியலின் மிக முக்கியமான மட்கலை பாரம்பரியங்களில் ஒன்றாகும். தமிழகத்தில் இது இரும்பு காலம் (கி.மு. 1000–300) மற்றும் ஆரம்பகால சங்க காலத்துடன் நெருங்கிய தொடர்புடையது.

வரையறை மற்றும் தோற்றம்:
• கருப்பு சிவப்பு மட்பாண்டங்கள் தனித்துவமான இரட்டை வண்ண தோற்றம் கொண்டவை: உட்புறம் மற்றும் மேல் வெளிப்புறம் கருப்பாகவும், கீழ் வெளிப்புறம் செங்கலர் சிவப்பாகவும் இருக்கும்.
• இந்த தனித்துவமான வண்ணம் தலைகீழ் சுடல் முறையால் (Inverted Firing Technique) அடையப்படுகிறது.

தயாரிப்பு முறை:
• களிமண்ணை சக்கரத்தில் வடிவமைத்து உலரவிடுவர்.
• பாத்திரத்தை தலைகீழாக சூளையில் வைப்பர்.
• சுடும்போது மேல்புறம் (குறைப்பு சூழலில்) கருப்பாகவும், கீழ்புறம் (ஆக்சிஜன் சூழலில்) சிவப்பாகவும் ஆகும்.

தமிழகத்தில் கண்டெடுக்கப்பட்ட தளங்கள்:
• ஆதிச்சநல்லூர் (திருநெல்வேலி) – இடுகாட்டு கலசங்கள் கண்டெடுக்கப்பட்ட மிக முக்கியமான தளம்.
• உறையூர் (திருச்சிராப்பள்ளி) – உற்பத்தி மையம்; சாயத்தொட்டிகளும் கிடைத்தன.
• கோடுமணல் (ஈரோடு) – இரும்பு கருவிகள், மணிகள், கல்வெட்டுடன் BRW கண்டெடுப்பு.
• பொருந்தல் (பழனி, திண்டுக்கல்) – நெல் தானியங்களுடன் BRW.
• அரிக்கமேடு (புதுச்சேரி) – ரோமன் பாத்திரங்களுடன் BRW, வணிக தொடர்பை உறுதிப்படுத்துகிறது.

BRW உள்ளே கண்டெடுக்கப்பட்ட பொருட்கள்:
1. இரும்பு ஆயுதங்கள் – வாள், ஈட்டி, அம்பு நுனி
2. இரும்பு கருவிகள் – கத்தி, அரிவாள், வேளாண்மை கருவிகள்
3. அணிகலன்கள் – தங்க தகட்டு, கோமேதக மணிகள், கண்ணாடி மணிகள்
4. நாணயங்கள் – குத்துமுத்திரை நாணயங்கள்
5. தானியங்கள் – நெல், தினை (உணவு படைப்பு)
6. விலங்கு எலும்புகள் – சடங்கு படைப்பு

இடுகாட்டு பயன்பாடு:
• BRW பாத்திரங்கள் முக்கியமாக இடுகாட்டு கலசங்களாக (முதுமக்கள் தாழி) பயன்படுத்தப்பட்டன.
• இறந்தவர்களை பெரிய BRW கலசங்களில் வைத்து புதைத்தனர்.
• இடுகாட்டு பொருட்கள் இறந்தவரின் சமூக நிலை, தொழில் மற்றும் வணிக தொடர்புகளை வெளிப்படுத்துகின்றன.

BRW மீதுள்ள குறியீடுகள்:
• கீறல் குறிகள் – சுடுவதற்கு முன்பு அல்லது பின்பு செதுக்கப்பட்டவை.
• மீன் சின்னம் – பாண்டிய அரசின் சின்னம்.
• ஸ்வஸ்திக – மங்கல சின்னம்.
• சூரியன், திரிசூலம், நட்சத்திர வடிவங்கள்.

வரலாற்று முக்கியத்துவம்:
1. BRW இரும்பு கால தமிழர்களின் மேம்பட்ட சூளை தொழில்நுட்பத்தை உறுதிப்படுத்துகிறது.
2. இடுகாட்டு பொருட்கள் ரோமன், தென்கிழக்கு ஆசிய வணிக தொடர்புகளை காட்டுகின்றன.
3. கீறல் குறிகள் தமிழகத்தில் எழுத்தின் ஆரம்ப வடிவங்களில் ஒன்றாக கருதப்படுகின்றன.

முடிவுரை:
கருப்பு சிவப்பு மட்பாண்டம் வெறும் மட்கலை வகை மட்டுமல்ல — இது இரும்பு கால தமிழ் நாகரிகத்தின் கலாச்சார அடையாளம். அதன் தனித்துவமான தயாரிப்பு தொழில்நுட்பமும் பரவலான பரிவர்த்தனையும் பண்டைய தமிழரின் சமூக, மத மற்றும் பொருளாதார வாழ்க்கையை புரிந்துகொள்ள இன்றியமையாதது.

முக்கிய சொற்கள்: BRW, தலைகீழ் சுடல், இடுகாட்டு கலசம், ஆதிச்சநல்லூர், இரும்பு காலம், கீறல் குறிகள்`,
    keywordsEnglish: ["Black and Red Ware", "inverted firing", "burial urn", "Adichanallur", "Iron Age", "graffiti marks", "Kodumanal", "dual-tone"],
    keywordsTamil: ["கருப்பு சிவப்பு மட்பாண்டம்", "தலைகீழ் சுடல்", "இடுகாட்டு கலசம்", "ஆதிச்சநல்லூர்", "இரும்பு காலம்", "கீறல் குறிகள்"],
  },

  {
    unit: "Unit I", qNo: 20, marks: 16,
    questionEnglish: "Write in detail about the incised marks and symbols engraved on ancient Indian pottery.",
    questionTamil: "பண்டைய இந்தியாவில் மட்பாண்டங்களில் பொறிக்கப்பட்ட கீறல் குறிகளை விரிவாக எழுதுங்கள்.",
    answerEnglish: `Introduction:
Incised marks and symbols on ancient Indian pottery are among the earliest forms of symbolic communication and proto-writing found on the subcontinent. In Tamil Nadu, pottery symbols from the Iron Age and Sangam period provide invaluable evidence of religious beliefs, trade practices, political identity, and early literacy.

What Are Incised Marks?
Incised marks (கீறல் குறிகள்) are lines, symbols, or figures scratched, carved, or painted onto clay pots either before firing (when clay is leather-hard) or after firing. They differ from writing in that they use symbols rather than phonetic letters, though some may represent early script forms.

Methods of Creating Marks:
1. Pre-firing incision – Scratched into the surface before the pot is fired; marks are embedded permanently.
2. Post-firing graffiti – Scratched after firing with a sharp instrument; marks appear lighter/different in texture.
3. Painted designs – Applied with pigment (red ochre, black manganese) before or after firing.
4. Impressed marks – Stamped using a tool or seal into soft clay before firing.
5. Applied relief – Small clay shapes applied to the surface and then fired.

Types of Symbols Found on Ancient Indian Pottery:

1. Geometric Symbols:
• Circles (வட்டங்கள்) – representing sun or wheel
• Crosses (சிலுவைகள்) – directional or auspicious symbols
• Triangles (முக்கோணம்) – possibly representing mountains or fire
• Dots and lines – counting marks or ownership indicators
• Spirals – representing water or eternity

2. Auspicious Symbols:
• Swastika (ஸ்வஸ்திக) – found extensively at Adichanallur, Kodumanal; represents good fortune
• Triskelion / Three-pronged symbol – associated with Shiva
• Lotus (தாமரை) – purity and divinity
• Conch (சங்கு) – sacred Vishnu emblem

3. Royal/Political Emblems:
• Fish (மீன்) – emblem of Pandya kings; found on pottery in Madurai region
• Tiger (புலி) – Chola emblem
• Bow (வில்) – Chera emblem
• These emblems on pottery may indicate royal patronage or state-controlled production

4. Human and Animal Figures:
• Stick figures of warriors and hunters
• Bovine (cattle) forms – reflecting pastoral life
• Birds (peacock, crane) – auspicious birds in Tamil culture
• Fish and marine life – associated with coastal (Neythal) communities

5. Astronomical Symbols:
• Sun (சூரியன்) with rays
• Crescent moon (பிறை)
• Star patterns

6. Script-like Marks (Proto-writing):
• Tamil Brahmi letters or proto-Tamil script marks found on Sangam-era pottery (Kodumanal, Porunthal, Alagankulam)
• Short inscriptions of 1–3 letters — possibly names or ownership marks
• Graffiti marks that resemble but predate the formal Tamil script
• The Adichanallur pottery contains the earliest known proto-Tamil inscriptions

Major Archaeological Sites and Their Symbols:

Site | Notable Symbols Found
Adichanallur | Swastika, fish, sun, proto-Tamil graffiti
Kodumanal | Fish, geometric patterns, bipolar discharge marks, proto-Tamil letters
Uraiyur | Trade marks, geometric signs
Arikamedu | Brahmi letters, Roman symbols, geometric patterns
Porunthal | Proto-Tamil Brahmi inscriptions
Keeladi | Tamil Brahmi letters on pottery (5th–3rd century BCE)

Significance of Keeladi Excavations:
The Keeladi (Sivaganga district) excavations have revealed pottery with Tamil Brahmi inscriptions dating to the 6th–3rd century BCE, pushing back the dating of Tamil script and literacy significantly. These marks confirm that ordinary citizens — not just kings — could write in ancient Tamil Nadu.

Functions of Pottery Symbols:
1. Religious purpose – Protect vessels and contents; invoke divine blessings
2. Ownership marks – Identify the maker, owner, or trade merchant
3. Quantity marks – Count vessels in trade or taxation
4. Clan/dynasty identification – Royal emblems stamp authority
5. Proto-writing – Early attempts to record language visually
6. Decorative purpose – Aesthetic embellishment

BRW and Symbols:
Black and Red Ware (BRW) commonly bears incised symbols before and after firing. The fish, swastika, and geometric patterns on BRW at Iron Age sites are among the most studied symbols in South Indian archaeology.

Comparison with Indus Valley Symbols:
• Indus Valley Civilization (2600–1900 BCE) also had pictographic symbols on seals and pottery.
• Tamil pottery symbols show cultural continuity from Megalithic to historic periods.
• Some scholars connect early Tamil graffiti marks with Indus script traditions, though this remains debated.

Conclusion:
Incised marks on ancient Indian pottery are a window into the minds and beliefs of prehistoric and early historic peoples. In Tamil Nadu, they trace the evolution from simple ownership scratches to formal Tamil Brahmi writing, revealing a sophisticated and literate ancient Tamil civilization.

Keywords: incised marks, graffiti, Swastika, fish symbol, Adichanallur, Keeladi, proto-Tamil script, BRW, Tamil Brahmi`,
    answerTamil: `அறிமுகம்:
பண்டைய இந்திய மட்பாண்டங்களில் உள்ள கீறல் குறிகள் மற்றும் சின்னங்கள் துணைக்கண்டத்தில் காணப்படும் ஆரம்பகால குறியீட்டு தொடர்பு மற்றும் முன்-எழுத்து வடிவங்களில் சிலவாகும். தமிழகத்தில் இரும்பு காலம் மற்றும் சங்க காலத்து மட்கலை சின்னங்கள் மதம், வணிகம், அரசியல் அடையாளம் மற்றும் ஆரம்பகால எழுத்தறிவு பற்றிய அரும்பெரும் சான்றுகளை வழங்குகின்றன.

கீறல் குறிகள் என்றால் என்ன?
கீறல் குறிகள் என்பது சுடுவதற்கு முன் (அரை-உலர்ந்த நிலையில்) அல்லது சுட்ட பின் களிமண் பாத்திரங்களில் கீறி, செதுக்கி அல்லது வர்ணம் பூசப்பட்ட கோடுகள், சின்னங்கள் அல்லது உருவங்கள் ஆகும்.

குறிகள் உருவாக்கும் முறைகள்:
1. சுடுமுன் கீறல் – சுடுவதற்கு முன் பாத்திரத்தில் செதுக்கப்படும்; குறிகள் நிரந்தரமாகிவிடும்.
2. சுட்டபின் கீறல் – சுட்ட பின் கூர்மையான கருவியால் கீறப்படும்.
3. வர்ண ஓவியம் – சுடுமுன் அல்லது சுட்டபின் நிறமிகளால் (சிவப்பு ஓக்ரர், கருப்பு மாங்கனீஸ்) பூசப்படும்.
4. அழுத்திய குறிகள் – மென்மையான களிமண்ணில் கருவி அல்லது முத்திரையால் பதிக்கப்படும்.

பண்டைய இந்திய மட்பாண்டங்களில் காணப்படும் சின்னங்கள்:

1. வடிவியல் சின்னங்கள்:
• வட்டங்கள் – சூரியன் அல்லது சக்கரத்தை குறிக்கும்
• சிலுவைகள் – திக்கு அல்லது மங்கல சின்னம்
• முக்கோணம் – மலை அல்லது நெருப்பை குறிக்கலாம்
• புள்ளிகள் மற்றும் கோடுகள் – எண்ணிக்கை அல்லது உரிமை குறிகள்

2. மங்கல சின்னங்கள்:
• ஸ்வஸ்திக – ஆதிச்சநல்லூர், கோடுமணலில் பரவலாக காணப்படுகிறது; நற்பொருளின் சின்னம்
• தாமரை – தூய்மை மற்றும் தெய்வீகம்
• சங்கு – விஷ்ணுவின் புனித சின்னம்

3. அரச/அரசியல் சின்னங்கள்:
• மீன் – பாண்டிய அரசரின் சின்னம்; மதுரை பகுதி மட்பாண்டங்களில் காணப்படுகிறது
• புலி – சோழர் சின்னம்
• வில் – சேரர் சின்னம்

4. மனித மற்றும் விலங்கு உருவங்கள்:
• வீரர்கள் மற்றும் வேட்டையாடுபவர்களின் உருவங்கள்
• மாடு வடிவங்கள் – மேய்ச்சல் வாழ்க்கையை பிரதிபலிக்கும்
• பறவைகள் (மயில், நாரை) – தமிழ் கலாச்சாரத்தில் மங்கல பறவைகள்

5. வானியல் சின்னங்கள்:
• கதிர்களுடன் சூரியன்
• பிறை நிலவு
• நட்சத்திர வடிவங்கள்

6. எழுத்து போன்ற குறிகள் (முன்-எழுத்து):
• கோடுமணல், பொருந்தல், ஆலங்குளம் போன்ற சங்க கால மட்பாண்டங்களில் தமிழ்-பிராமி எழுத்துகள்
• 1–3 எழுத்துக்களுடன் குறுகிய கல்வெட்டுகள் — பெயர்கள் அல்லது உரிமை குறிகள் இருக்கலாம்
• ஆதிச்சநல்லூர் மட்பாண்டங்களில் ஆரம்பகால தமிழ் கல்வெட்டுகள் காணப்படுகின்றன

முக்கிய தொல்லியல் தளங்கள் மற்றும் அவற்றில் காணப்படும் சின்னங்கள்:
• ஆதிச்சநல்லூர் – ஸ்வஸ்திக, மீன், சூரியன், முன்-தமிழ் கல்வெட்டுகள்
• கோடுமணல் – மீன், வடிவியல் வடிவங்கள், தமிழ் பிராமி எழுத்துகள்
• உறையூர் – வணிக குறிகள், வடிவியல் சின்னங்கள்
• கீழடி – கி.மு. 6–3ஆம் நூற்றாண்டு தமிழ் பிராமி கல்வெட்டுகள்

கீழடி அகழாய்வின் முக்கியத்துவம்:
கீழடி (சிவகங்கை மாவட்டம்) அகழாய்வுகள் கி.மு. 6–3ஆம் நூற்றாண்டு தமிழ் பிராமி கல்வெட்டுகளுடன் மட்பாண்டங்களை வெளிப்படுத்தியுள்ளன, தமிழ் எழுத்தின் வயதை கணிசமாக பின்னோக்கி தள்ளுகிறது. சாதாரண குடிமக்களும் எழுத தெரிந்திருந்தனர் என்பதை இவை உறுதிப்படுத்துகின்றன.

மட்கலை சின்னங்களின் செயல்பாடுகள்:
1. மத நோக்கம் – தெய்வீக ஆசிர்வாதம் வேண்டல்
2. உரிமை குறிகள் – தயாரிப்பாளர் அல்லது வணிகரை அடையாளப்படுத்தல்
3. எண்ணிக்கை குறிகள் – வணிக அல்லது வரி நோக்கில் பாத்திரங்களை கணக்கிடுதல்
4. அரசு/குலம் அடையாளம் – அரச சின்னங்கள் அதிகாரத்தை குறிக்கும்
5. முன்-எழுத்து – மொழியை காட்சிப்படுத்தும் ஆரம்ப முயற்சிகள்

முடிவுரை:
பண்டைய இந்திய மட்பாண்டங்களில் கீறல் குறிகள் வரலாற்றுக்கு முந்தைய மக்களின் மனது மற்றும் நம்பிக்கைகளுக்கான சாளரங்களாகும். தமிழகத்தில் இவை எளிய உரிமை கீறல்களிலிருந்து முறையான தமிழ் பிராமி எழுத்து வரையிலான பரிணாமத்தை காட்டுகின்றன.

முக்கிய சொற்கள்: கீறல் குறிகள், ஸ்வஸ்திக, மீன் சின்னம், ஆதிச்சநல்லூர், கீழடி, முன்-தமிழ் எழுத்து, தமிழ் பிராமி`,
    keywordsEnglish: ["incised marks", "graffiti", "Swastika", "fish symbol", "Adichanallur", "Keeladi", "proto-Tamil script", "BRW", "Tamil Brahmi", "Kodumanal"],
    keywordsTamil: ["கீறல் குறிகள்", "ஸ்வஸ்திக", "மீன் சின்னம்", "ஆதிச்சநல்லூர்", "கீழடி", "முன்-தமிழ் எழுத்து", "தமிழ் பிராமி"],
  },

  {
    unit: "Unit I", qNo: 21, marks: 16,
    questionEnglish: "Explain the efforts taken to preserve ancient weaving and pottery technologies.",
    questionTamil: "பழங்கால நெசவு மற்றும் குயவர் தொழில்நுட்பங்களைப் பாதுகாக்கும் முயற்சிகள் குறித்து விளக்குக.",
    answerEnglish: `Introduction:
The ancient weaving and pottery technologies of Tamil Nadu represent thousands of years of accumulated craftsmanship, cultural expression, and technical knowledge. Preserving these traditions is crucial for maintaining cultural identity and providing livelihoods for artisan communities. Various government, non-governmental, academic, and international efforts have been made toward their preservation.

I. Preservation of Ancient Weaving Technology:

A. Government Initiatives:
1. Handloom Development Programmes – The Tamil Nadu Handloom Weavers' Co-operative Society (Co-optex) supports traditional weavers through training, marketing, and financial assistance.
2. National Handloom Development Programme (NHDP) – Central government scheme providing subsidies, cluster development, and market access to traditional weavers.
3. Geographical Indication (GI) Tags – Products like Kancheepuram silk, Madurai Sungudi, Salem silk, Thanjavur silk have received GI tags protecting their uniqueness.
4. Weavers' Service Centres – Government-run centres at Chennai, Varanasi, Guwahati provide technical training, design development, and quality testing.
5. National Institute of Fashion Technology (NIFT) – Collaborates with traditional weavers to modernize designs while preserving techniques.
6. Pradhan Mantri MUDRA Yojana – Financial support for handloom micro-enterprises.

B. Recognition and Awards:
1. National Awards for Master Craftspersons – Given by Ministry of Textiles to outstanding weavers.
2. Shilp Guru Awards – Highest recognition for traditional craftspersons.
3. UNESCO Intangible Cultural Heritage listings encourage preservation of traditional textile arts.

C. Documentation and Research:
1. Textile museums (Chennai Government Museum Textile Section) document ancient fabrics.
2. Craft Documentation Projects – Recording techniques before they disappear.
3. Academic research at universities studying Sangam-era weaving from literature and archaeology.
4. Tamil Virtual Academy digitizes ancient texts describing weaving processes.

D. Community and Market Efforts:
1. Weavers' co-operative societies ensure collective marketing and fair prices.
2. Craft fairs (Dastkar, Crafts Council of India exhibitions) provide exposure and sales.
3. E-commerce platforms (Amazon Karigar, GoCoop) enable weavers to sell directly online.
4. Revival of specific weaving traditions: Ponduru Khadi (Andhra), Kanchi silk, Chettinad cotton.

II. Preservation of Ancient Pottery Technology:

A. Government Initiatives:
1. All India Handicrafts Board supports traditional potters through material subsidies and training.
2. National Handicrafts Development Programme – Financial and marketing support for pottery artisans.
3. Khadi and Village Industries Commission (KVIC) – Promotes traditional clay craft as rural industry.
4. Terracotta Craft Clusters – Established in regions with strong pottery traditions (Pondicherry, Thanjavur).

B. Recognition:
1. GI Tags for specific pottery traditions: Thanjavur bronze, Kondapalli toys (terracotta-based).
2. National crafts awards recognizing exceptional potters.

C. Archaeological Preservation:
1. Archaeological Survey of India (ASI) excavates and conserves ancient pottery sites.
2. Museums in Chennai, Madurai, and Tiruchirappalli display BRW, Sangam-era pottery.
3. Adichanallur excavation material is housed in Government Museum, Chennai.
4. Keeladi Archaeological Museum preserves and displays excavated pottery with inscriptions.
5. UNESCO World Heritage Site status for associated monuments encourages preservation of pottery contexts.

D. Educational Preservation:
1. Pottery is included in school curriculum under Arts and Crafts education.
2. Government art colleges (Government College of Arts and Crafts, Chennai) teach traditional pottery.
3. Craft Documentation – Recording the potter's wheel techniques, firing methods of Velloor Karigiri pottery.
4. Documentary films on traditional potters by organizations like Craft Documentation Project.

E. Community-Based Conservation:
1. Traditional pottery communities (Kuyinar, Velaan) are supported through Self-Help Groups (SHGs).
2. NGOs like Crafts Council of Tamil Nadu work directly with potters for skill preservation and market access.
3. Rural artisan hubs established in pottery-specializing villages.

III. Challenges in Preservation:
1. Competition from cheap plastic and machine-made products replacing traditional pottery and textiles.
2. Migration of skilled artisans to cities for better-paying jobs.
3. Loss of traditional knowledge due to lack of documentation before elderly artisans pass away.
4. Limited market access for handmade products compared to factory goods.
5. Climate change affecting natural dye plants and clay sources.

IV. Technological Integration for Preservation:
1. Digital documentation – Video recording of weaving and pottery techniques.
2. 3D scanning of ancient pots for digital archival.
3. Tamil Virtual Academy digitizing Sangam literature describing craft processes.
4. CAD/CAM tools used to preserve traditional design patterns digitally.
5. Online platforms enabling global reach for artisanal products.

Conclusion:
Preserving ancient weaving and pottery technologies requires a multi-pronged approach combining government policy, community support, academic research, market development, and digital documentation. These crafts are not merely occupations — they are living links to Tamil cultural heritage spanning thousands of years. Sustained collective effort is essential to ensure they thrive for future generations.

Keywords: Co-optex, GI tags, Kancheepuram silk, handloom, ASI, Keeladi, terracotta, documentation, UNESCO, artisans`,
    answerTamil: `அறிமுகம்:
தமிழகத்தின் பண்டைய நெசவு மற்றும் மட்கலை தொழில்நுட்பங்கள் ஆயிரக்கணக்கான ஆண்டுகளாக திரட்டப்பட்ட கைவினை நுட்பம், கலாச்சார வெளிப்பாடு மற்றும் தொழில்நுட்ப அறிவை பிரதிநிதித்துவப்படுத்துகின்றன. இவற்றை பாதுகாப்பது கலாச்சார அடையாளத்தை பேணுவதற்கும் கைவினை சமூகங்களுக்கு வாழ்வாதாரம் வழங்குவதற்கும் இன்றியமையாதது.

I. பண்டைய நெசவு தொழில்நுட்ப பாதுகாப்பு:

அ. அரசு முயற்சிகள்:
1. கைத்தறி வளர்ச்சி திட்டங்கள் – Co-optex பாரம்பரிய நெசவாளர்களுக்கு பயிற்சி, சந்தைப்படுத்தல் மற்றும் நிதி உதவி வழங்குகிறது.
2. தேசிய கைத்தறி வளர்ச்சி திட்டம் (NHDP) – மத்திய அரசு திட்டம் மானியங்கள் மற்றும் சந்தை வாய்ப்புகளை வழங்குகிறது.
3. புவியியல் குறிப்பான் (GI) தகவல்கள் – காஞ்சிபுரம் பட்டு, மதுரை சுங்குடி, சேலம் பட்டு GI தகவல்கள் பெற்றுள்ளன.
4. நெசவாளர் சேவை மையங்கள் – தொழில்நுட்ப பயிற்சி மற்றும் வடிவமைப்பு வளர்ச்சி வழங்குகின்றன.
5. ஆசைரியர் நுட்பகலை நிறுவனம் (NIFT) – பாரம்பரிய நுட்பங்களை பேணி நவீன வடிவமைப்புகளுடன் ஒருங்கிணைக்கிறது.

ஆ. அங்கீகாரம் மற்றும் விருதுகள்:
1. தேசிய முதன்மை கைவினை விருதுகள் – சிறந்த நெசவாளர்களுக்கு கொடுக்கப்படுகின்றன.
2. சிற்ப குரு விருதுகள் – பாரம்பரிய கைவினைஞர்களுக்கான மிக உயர்ந்த அங்கீகாரம்.
3. யுனெஸ்கோ அருவமான கலாச்சார பாரம்பரிய பட்டியல்கள் பாரம்பரிய ஜவுளி கலைகளை பாதுகாக்க ஊக்கமளிக்கின்றன.

இ. ஆவணப்படுத்தல் மற்றும் ஆராய்ச்சி:
1. ஜவுளி அருங்காட்சியகங்கள் பண்டைய ஆடைகளை ஆவணப்படுத்துகின்றன.
2. கைவினை ஆவணப்படுத்தல் திட்டங்கள் – மறைவதற்கு முன் நுட்பங்களை பதிவு செய்கின்றன.
3. தமிழ் இணையக் கல்விக் கழகம் நெசவு செயல்முறைகளை விவரிக்கும் சங்க நூல்களை டிஜிட்டல் வடிவாக்குகிறது.

II. பண்டைய மட்கலை தொழில்நுட்ப பாதுகாப்பு:

அ. அரசு முயற்சிகள்:
1. அகில இந்திய கைவினை வாரியம் – பாரம்பரிய குயவர்களுக்கு மானியம் மற்றும் பயிற்சி வழங்குகிறது.
2. தேசிய கைவினை வளர்ச்சி திட்டம் – நிதி மற்றும் சந்தை ஆதரவு.
3. காதி மற்றும் கிராம தொழில்கள் ஆயோகம் (KVIC) – கிராமிய கைவினையை மேம்படுத்துகிறது.

ஆ. தொல்லியல் பாதுகாப்பு:
1. இந்திய தொல்லியல் கழகம் (ASI) பண்டைய மட்கலை தளங்களை அகழ்வாராய்ந்து பாதுகாக்கிறது.
2. சென்னை, மதுரை, திருச்சி அருங்காட்சியகங்கள் BRW மற்றும் சங்க கால மட்பாண்டங்களை காட்சிப்படுத்துகின்றன.
3. ஆதிச்சநல்லூர் அகழ்வாராய்வு பொருட்கள் சென்னை அரசு அருங்காட்சியகத்தில் வைக்கப்பட்டுள்ளன.
4. கீழடி தொல்லியல் அருங்காட்சியகம் கல்வெட்டுடன் கூடிய மட்பாண்டங்களை பாதுகாக்கிறது.

இ. கல்வி பாதுகாப்பு:
1. கைவினை மற்றும் கலை கல்வியில் மட்கலை பள்ளி பாடத்திட்டத்தில் சேர்க்கப்பட்டுள்ளது.
2. அரசு கலை கல்லூரிகள் பாரம்பரிய மட்கலையை கற்பிக்கின்றன.
3. வேலூர் கரிகிரி மட்கலை நுட்பங்களை பதிவு செய்யும் ஆவணப்படுத்தல்.

III. பாதுகாப்பில் சவால்கள்:
1. மலிவான பிளாஸ்டிக் மற்றும் இயந்திர தயாரிப்புகளின் போட்டி.
2. திறன்மிக்க கைவினைஞர்கள் நகரங்களுக்கு இடம்பெயர்வு.
3. முதியவர்கள் இறப்பதற்கு முன் ஆவணப்படுத்தல் இல்லாமல் பாரம்பரிய அறிவு இழப்பு.
4. ஆலை தயாரிப்புகளுடன் ஒப்பிடும்போது கைவினை பொருட்களுக்கு வரையறுக்கப்பட்ட சந்தை வாய்ப்பு.

IV. பாதுகாப்பிற்கான தொழில்நுட்ப ஒருங்கிணைப்பு:
1. டிஜிட்டல் ஆவணப்படுத்தல் – நெசவு மற்றும் மட்கலை நுட்பங்களின் காணொளி பதிவு.
2. பண்டைய பாத்திரங்களின் 3D ஸ்கேனிங் டிஜிட்டல் காப்பகத்திற்காக.
3. ஆன்லைன் தளங்கள் கைவினை பொருட்களுக்கு உலகளாவிய வெளிப்பாட்டை வழங்குகின்றன.

முடிவுரை:
பண்டைய நெசவு மற்றும் மட்கலை தொழில்நுட்பங்களை பாதுகாக்க அரசு கொள்கை, சமூக ஆதரவு, கல்வி ஆராய்ச்சி, சந்தை வளர்ச்சி மற்றும் டிஜிட்டல் ஆவணப்படுத்தல் ஒருங்கிணைந்த அணுகுமுறை தேவை. இந்த கைவினைகள் வெறும் தொழில்கள் மட்டுமல்ல — ஆயிரக்கணக்கான ஆண்டுகளாக நீண்டுவரும் தமிழ் கலாச்சார பாரம்பரியத்திற்கான உயிரோட்டமான இணைப்புகளாகும்.

முக்கிய சொற்கள்: Co-optex, GI தகவல்கள், காஞ்சிபுரம் பட்டு, ASI, கீழடி, மட்கலை, ஆவணப்படுத்தல், யுனெஸ்கோ`,
    keywordsEnglish: ["Co-optex", "GI tags", "Kancheepuram silk", "handloom", "ASI", "Keeladi", "terracotta", "documentation", "UNESCO"],
    keywordsTamil: ["Co-optex", "GI தகவல்கள்", "காஞ்சிபுரம் பட்டு", "ASI", "கீழடி", "மட்கலை", "ஆவணப்படுத்தல்"],
  },

  // ─── UNIT II ───
  {
    unit: "Unit II", qNo: 1, marks: 2,
    questionEnglish: "What is architecture?",
    questionTamil: "கட்டடக்கலை என்றால் என்ன?",
    answerEnglish: "Architecture is the art and science of designing and constructing buildings and structures. It involves planning, aesthetics, structural engineering, and construction techniques. In Tamil context, it includes temple architecture, palace construction, and fortifications.",
    answerTamil: "கட்டடக்கலை என்பது கட்டடங்களை வடிவமைத்து கட்டுவதற்கான கலை மற்றும் அறிவியல். திட்டமிடல், அழகியல், கட்டமைப்பு பொறியியல் அடங்கும். தமிழ் சூழலில் கோவில் கட்டடக்கலை, அரண்மனை, கோட்டைகள் அடங்கும்.",
    keywordsEnglish: ["architecture", "design", "construction", "temple"],
    keywordsTamil: ["கட்டடக்கலை", "வடிவமைப்பு", "கட்டுமானம்", "கோவில்"],
  },
  {
    unit: "Unit II", qNo: 2, marks: 2,
    questionEnglish: "Name some construction materials used during the Sangam period.",
    questionTamil: "சங்ககால கட்டுமானப் பொருட்கள் சில நற்றை கூறுக.",
    answerEnglish: "Sangam period construction materials: (1) Stone – for temples and hero stones; (2) Brick – sun-dried and kiln-fired; (3) Timber – for pillars and roofs; (4) Clay/mud – for walls; (5) Thatched grass – for roofing. Lime mortar was used as binding agent.",
    answerTamil: "சங்க கால கட்டுமானப் பொருட்கள்: (1) கல் – கோவில்கள், நடுகற்களுக்கு; (2) செங்கல் – சூரிய/சூளை முறையில் தயாரித்தவை; (3) மரம் – தூண்கள், கூரைகளுக்கு; (4) மண் – சுவர்களுக்கு; (5) புல் – கூரைக்கு. சுண்ணாம்பு சாந்து பிணைப்பு பொருளாக பயன்பட்டது.",
    keywordsEnglish: ["stone", "brick", "timber", "clay", "lime mortar"],
    keywordsTamil: ["கல்", "செங்கல்", "மரம்", "மண்", "சுண்ணாம்பு சாந்து"],
  },
  {
    unit: "Unit II", qNo: 3, marks: 2,
    questionEnglish: "Which script is predominantly found on hero stones discovered in Tamil Nadu?",
    questionTamil: "தமிழகத்தில் கண்டெடுக்கப்பட்ட நடுகற்களில் பெரும்பாலும் எந்த எழுத்து மொழி காணப்படுகிறது?",
    answerEnglish: "Tamil-Brahmi script and later Vatteluttu (Tamil script) are predominantly found on hero stones in Tamil Nadu. These inscriptions record the warrior's name, battle achievements, the king served, and the village that erected the stone.",
    answerTamil: "தமிழகத்தில் நடுகற்களில் தமிழ்-பிராமி எழுத்தும் பிறகு வட்டெழுத்தும் பெரும்பாலும் காணப்படுகின்றன. இவற்றில் வீரனின் பெயர், போர் சாதனைகள், சேவை செய்த அரசன், கல் நட்ட கிராமம் பதிவாகியுள்ளன.",
    keywordsEnglish: ["Tamil-Brahmi", "Vatteluttu", "hero stone", "inscription"],
    keywordsTamil: ["தமிழ்-பிராமி", "வட்டெழுத்து", "நடுகல்", "கல்வெட்டு"],
  },
  {
    unit: "Unit II", qNo: 4, marks: 2,
    questionEnglish: "What are moats?",
    questionTamil: "அகழிகள் என்றால் என்ன?",
    answerEnglish: "Moats (அகழி) are deep, wide water-filled ditches dug around a fort or city as a defensive barrier against enemy attacks. They prevented direct attacks on walls and served as water sources during sieges.",
    answerTamil: "அகழிகள் என்பது கோட்டை அல்லது நகரத்தை சுற்றி தோண்டப்பட்ட ஆழமான, நீர் நிரம்பிய குழிகள். எதிரி தாக்குதல்களுக்கு எதிரான பாதுகாப்பு தடையாக செயல்படுகின்றன. முற்றுகையின்போது நீர் ஆதாரமாகவும் பயன்பட்டன.",
    keywordsEnglish: ["moat", "defense", "fort", "water barrier"],
    keywordsTamil: ["அகழி", "பாதுகாப்பு", "கோட்டை", "நீர் தடை"],
  },
  {
    unit: "Unit II", qNo: 5, marks: 2,
    questionEnglish: "What are the types of temples built in India?",
    questionTamil: "இந்தியாவில் கட்டப்படும் கோவில்களின் வகைகள் யாவை?",
    answerEnglish: "Main styles of Indian temple architecture: (1) Nagara style – curvilinear shikhara (North India); (2) Dravidian style – pyramidal gopuram (South India); (3) Vesara style – hybrid of both (Deccan); (4) Rock-cut temples; (5) Cave temples.",
    answerTamil: "இந்திய கோவில் கட்டடக்கலையின் முக்கிய பாணிகள்: (1) நாகர பாணி – வளைந்த சிகரம் (வட இந்தியா); (2) திராவிட பாணி – கூர்நுனி கோபுரம் (தென்னிந்தியா); (3) வேசர பாணி – இரண்டின் கலவை (தக்காணம்); (4) பாறைக் கோவில்; (5) குகைக் கோவில்.",
    keywordsEnglish: ["Nagara", "Dravidian", "Vesara", "rock-cut", "gopuram"],
    keywordsTamil: ["நாகர பாணி", "திராவிட பாணி", "வேசர பாணி", "கோபுரம்"],
  },
  {
    unit: "Unit II", qNo: 6, marks: 2,
    questionEnglish: "Which is considered the tallest temple gopuram in Tamil Nadu?",
    questionTamil: "தமிழகத்தின் மிக உயர்ந்த கோவில் கோபுரமாகக் கருதப்படுவது எது?",
    answerEnglish: "The Rajagopuram of Ranganathaswamy Temple, Srirangam (Tiruchirappalli) is considered the tallest gopuram in Tamil Nadu, standing approximately 73 metres (239 feet) — one of the tallest in Asia.",
    answerTamil: "திருச்சிராப்பள்ளி ஸ்ரீரங்கம் ரங்கநாதசுவாமி கோவிலின் ராஜகோபுரம் தமிழகத்தில் மிக உயர்ந்த கோபுரமாக கருதப்படுகிறது – சுமார் 73 மீட்டர் (239 அடி) உயரம். ஆசியாவிலேயே மிக உயர்ந்தவற்றில் ஒன்று.",
    keywordsEnglish: ["Srirangam", "Rajagopuram", "73 metres", "Ranganathaswamy"],
    keywordsTamil: ["ஸ்ரீரங்கம்", "ராஜகோபுரம்", "73 மீட்டர்", "ரங்கநாதசுவாமி"],
  },
  {
    unit: "Unit II", qNo: 7, marks: 2,
    questionEnglish: "What are the six stages (levels) of hero stones as mentioned by Tholkappiyar?",
    questionTamil: "தொல்காப்பியர் குறிப்பிடும் நடுகல்லுக்குரிய ஆறு நிலைகள் யாவை?",
    answerEnglish: "Six stages of hero stone installation (Tholkappiyam): (1) Selecting a suitable stone; (2) Bathing it ritually; (3) Erecting it in a public place; (4) Inscribing the warrior's deeds; (5) Worshipping the stone as a deity; (6) Conducting festivals in the hero's honor.",
    answerTamil: "தொல்காப்பியம் கூறும் ஆறு நிலைகள்: (1) தகுந்த கல் தேர்வு; (2) சடங்கு முறையில் நீராட்டுதல்; (3) பொது இடத்தில் நிலைநாட்டுதல்; (4) வீரன் சாதனைகள் பொறித்தல்; (5) தெய்வமாக வழிபடுதல்; (6) விழாக்கள் நடத்துதல்.",
    keywordsEnglish: ["Tholkappiyar", "hero stone", "six stages", "worship"],
    keywordsTamil: ["தொல்காப்பியர்", "நடுகல்", "ஆறு நிலைகள்", "வழிபாடு"],
  },
  {
    unit: "Unit II", qNo: 8, marks: 2,
    questionEnglish: "Name some grand temples built by the Cholas.",
    questionTamil: "சோழர்கள் காட்டிய பெருங்கோயில்கள் சில நற்றை கூறுக.",
    answerEnglish: "Grand Chola temples: (1) Brihadeeswara Temple, Thanjavur – Raja Raja Chola I (1010 CE); (2) Gangaikonda Cholapuram Temple – Rajendra Chola I; (3) Airavateswarar Temple, Darasuram – Raja Raja Chola II. All three are UNESCO World Heritage Sites.",
    answerTamil: "சோழர் பெருங்கோயில்கள்: (1) தஞ்சாவூர் பிரகதீஸ்வரர் – ராஜராஜ சோழன் I (கி.பி.1010); (2) கங்கைகொண்ட சோழபுரம் – ராஜேந்திர சோழன் I; (3) தாரசுரம் ஐராவதேஸ்வரர் – ராஜராஜ சோழன் II. மூன்றும் யுனெஸ்கோ உலக பாரம்பரிய தளங்கள்.",
    keywordsEnglish: ["Brihadeeswara", "Gangaikonda Cholapuram", "Airavateswarar", "UNESCO"],
    keywordsTamil: ["பிரகதீஸ்வரர்", "கங்கைகொண்ட சோழபுரம்", "ஐராவதேஸ்வரர்", "யுனெஸ்கோ"],
  },
  {
    unit: "Unit II", qNo: 9, marks: 2,
    questionEnglish: "Write a brief note on Thirumalai Nayakkar Palace.",
    questionTamil: "திருமலை நாயக்கர் அரண்மனை பற்றிக் குறிப்பு எழுக.",
    answerEnglish: "Thirumalai Nayakkar Palace in Madurai was built in 1636 CE by King Thirumalai Nayak. It blends Dravidian and Italian architecture, featuring massive pillars (~12 m high), a large courtyard (Swarga Vilasam), and ornate stucco work. Today it hosts a sound-and-light show.",
    answerTamil: "மதுரை திருமலை நாயக்கர் அரண்மனை 1636ல் திருமலை நாயக்கரால் கட்டப்பட்டது. திராவிட-இத்தாலிய கட்டடக்கலை கலவை. பிரமாண்ட தூண்கள் (~12 மீ), ஸ்வர்க்க விலாசம் முற்றம், சுண்ணாம்பு வேலைப்பாடு சிறப்புகள். இன்று ஒலி-ஒளி நிகழ்ச்சி நடக்கிறது.",
    keywordsEnglish: ["Thirumalai Nayak", "1636", "Madurai", "Dravidian", "Italian"],
    keywordsTamil: ["திருமலை நாயக்கர்", "1636", "மதுரை", "திராவிட", "இத்தாலிய"],
  },
  {
    unit: "Unit II", qNo: 10, marks: 2,
    questionEnglish: "Who built the Shore Temple at Mahabalipuram?",
    questionTamil: "மாமல்லபுரம் கடற்கரைக் கோயில் யாரால் கட்டப்பட்டது?",
    answerEnglish: "The Shore Temple at Mahabalipuram was built by Pallava king Narasimhavarman II (Rajasimha) around 700–728 CE. It is one of the oldest structural stone temples in South India and a UNESCO World Heritage Site, dedicated to Lord Shiva.",
    answerTamil: "மாமல்லபுரம் கடற்கரைக் கோயில் பல்லவ அரசன் நரசிம்மவர்மன் II (ராஜசிம்மன்) கி.பி.700–728ல் கட்டினார். தென்னிந்தியாவின் பழமையான கல் கோவில்களில் ஒன்று. யுனெஸ்கோ உலக பாரம்பரிய தளம்; சிவனுக்கு அர்ப்பணிக்கப்பட்டது.",
    keywordsEnglish: ["Shore Temple", "Narasimhavarman II", "Pallava", "700 CE", "UNESCO"],
    keywordsTamil: ["கடற்கரைக் கோவில்", "நரசிம்மவர்மன் II", "பல்லவர்", "யுனெஸ்கோ"],
  },
  {
    unit: "Unit II", qNo: 11, marks: 2,
    questionEnglish: "What are the other names of Mahabalipuram?",
    questionTamil: "மாமல்லபுரம் வேறு பெயர்கள் யாவை?",
    answerEnglish: "Mahabalipuram is also known as: (1) Mamallapuram – after Pallava king Mamalla (Narasimhavarman I); (2) Seven Pagodas – name given by European sailors for its coastal temples; (3) Pallava port – as the main seaport of the Pallava kingdom.",
    answerTamil: "மாமல்லபுரத்தின் வேறு பெயர்கள்: (1) மாமல்லபுரம் – பல்லவ அரசன் மாமல்லன் (நரசிம்மவர்மன் I) பெயரில்; (2) ஏழு கோபுரங்கள் – ஐரோப்பிய மாலுமிகள் அழைத்த பெயர்; (3) பல்லவ துறைமுகம் – பல்லவ அரசின் முக்கிய துறைமுகம்.",
    keywordsEnglish: ["Mamallapuram", "Seven Pagodas", "Pallava port"],
    keywordsTamil: ["மாமல்லபுரம்", "ஏழு கோபுரங்கள்", "பல்லவ துறைமுகம்"],
  },
  {
    unit: "Unit II", qNo: 12, marks: 2,
    questionEnglish: "What is the Pancha Pandava Rathas?",
    questionTamil: "பஞ்சபாண்டவர்கள் இரதங்கள் யாவை?",
    answerEnglish: "The Pancha Pandava Rathas (Five Rathas) at Mahabalipuram are five monolithic rock-cut temple chariots carved during Pallava king Narasimhavarman I's reign (7th century CE), named after the Pandava brothers: Dharmaraja, Bhima, Arjuna, Nakula-Sahadeva, and Draupadi.",
    answerTamil: "மாமல்லபுரம் பஞ்சபாண்டவர் இரதங்கள் பல்லவ அரசன் நரசிம்மவர்மன் I ஆட்சியில் (கி.பி.7ஆம் நூற்றாண்டு) ஒரே பாறையில் செதுக்கப்பட்ட ஐந்து கோவில் தேர்கள். தர்மராஜ, பீம, அர்ஜுன, நகுல-சகாதேவ, திரௌபதி என்று பெயரிடப்பட்டவை.",
    keywordsEnglish: ["Five Rathas", "Mahabalipuram", "Narasimhavarman I", "monolithic"],
    keywordsTamil: ["ஐந்து தேர்கள்", "மாமல்லபுரம்", "நரசிம்மவர்மன் I", "ஒரே பாறை"],
  },
  {
    unit: "Unit II", qNo: 13, marks: 2,
    questionEnglish: "What is a rock-cut cave temple?",
    questionTamil: "குடைரைக் கோவில் என்றால் என்ன?",
    answerEnglish: "A rock-cut cave temple (குடைவரைக் கோவில்) is a temple carved directly into a natural rock face or hillside without any separate construction. The entire structure — pillars, halls, and sanctum — is cut from a single rock mass. Examples: Pallava cave temples at Mahabalipuram.",
    answerTamil: "குடைவரைக் கோவில் என்பது இயற்கையான பாறையில் நேரடியாக கொத்தி வெட்டி அமைக்கப்பட்ட கோவில். தூண்கள், மண்டபங்கள், கருவறை ஆகியவை ஒரே பாறையிலிருந்து வெட்டப்படுகின்றன. எடுத்துக்காட்டு: மாமல்லபுரம் பல்லவர் குடைவரை கோவில்கள்.",
    keywordsEnglish: ["rock-cut", "cave temple", "Pallava", "Mahabalipuram"],
    keywordsTamil: ["குடைவரை", "குகைக் கோவில்", "பல்லவர்", "மாமல்லபுரம்"],
  },
  {
    unit: "Unit II", qNo: 14, marks: 2,
    questionEnglish: "Who built the 'Aayiram Kaal Mandapam' in Madurai Meenakshi Amman Temple?",
    questionTamil: "மதுரை மீனாட்சி அம்மன் கோயில் ஆயிரங்கால் மண்டபத்தைக் கட்டியவர் யார்?",
    answerEnglish: "The Aayiram Kaal Mandapam (Thousand-Pillared Hall) in Madurai Meenakshi Amman Temple was built by Nayak rulers, attributed to Ariyappa Nayak (or Viswanatha Nayak) in the 16th century CE. It has 985 sculpted pillars and is now used as an art museum.",
    answerTamil: "மதுரை மீனாட்சி கோவிலின் ஆயிரங்கால் மண்டபத்தை நாயக்கர் ஆட்சியாளர்கள் – குறிப்பாக அரியப்ப நாயக்கர் – கி.பி.16ஆம் நூற்றாண்டில் கட்டினார். 985 சிற்ப தூண்கள் உள்ளன. இன்று கலை அருங்காட்சியகமாக பயன்படுகிறது.",
    keywordsEnglish: ["Thousand Pillars", "Nayak", "16th century", "985 pillars", "Madurai"],
    keywordsTamil: ["ஆயிரங்கால் மண்டபம்", "நாயக்கர்", "985 தூண்கள்", "மதுரை"],
  },
  {
    unit: "Unit II", qNo: 15, marks: 2,
    questionEnglish: "Write a short note on Indo-Saracenic architecture.",
    questionTamil: "இந்தோ-சாரசனிக் கட்டடக்கலை குறிப்பு எழுக.",
    answerEnglish: "Indo-Saracenic architecture is a hybrid style developed during British colonial rule (19th–20th century), combining Indian (Mughal, Rajput, Dravidian), Islamic, and European Gothic elements. Features: domes, arches, minarets, verandahs. Examples: Madras High Court, Chennai Central Railway Station.",
    answerTamil: "இந்தோ-சாரசனிக் கட்டடக்கலை பிரிட்டிஷ் காலனிய ஆட்சியில் (19–20ஆம் நூற்றாண்டு) உருவான கலப்பு பாணி. இந்திய (முகலாய, திராவிட), இஸ்லாமிய, ஐரோப்பிய கோதிக் கூறுகளை இணைக்கிறது. சிறப்புகள்: குவிமாடங்கள், வளைவுகள், மினாரெட்கள். எடுத்துக்காட்டு: சென்னை உயர் நீதிமன்றம்.",
    keywordsEnglish: ["Indo-Saracenic", "British colonial", "domes", "minarets", "Madras High Court"],
    keywordsTamil: ["இந்தோ-சாரசனிக்", "பிரிட்டிஷ் காலம்", "குவிமாடங்கள்", "மினாரெட்கள்"],
  },
  
  {
    unit: "Unit II", qNo: 16, marks: 16,
    questionEnglish: "Describe the architectural styles of the Pallava period.",
    questionTamil: "பல்லவர் கால கட்டிடக் கலைகள் பற்றி விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
The Pallava dynasty (6th–9th century CE) was one of the most creative and influential patrons of architecture in South Indian history. Their artistic contributions marked the beginning of Dravidian temple architecture that would later be perfected by the Cholas and Vijayanagara kings.

Overview of Pallava Architecture:
Pallava architecture can be broadly classified into three phases:
• Phase I: Mahendravarman style (610–640 CE) – Rock-cut caves
• Phase II: Narasimhavarman style (640–674 CE) – Monolithic rathas and bas-reliefs
• Phase III: Rajasimha / Later Pallava style (674–800 CE) – Structural stone temples

Phase I – Rock-Cut Cave Temples (Mandapa Style):
The earliest Pallava architectural form, initiated by King Mahendravarman I (Chitramegha).

Characteristics:
• Temples cut directly into natural rock faces (குடைவரைக் கோவில்)
• Simple facades with lion-pillar bases (simha pilasters)
• Pillars with rearing lion at the base (vyala / yali)
• Single or multi-celled sanctuaries
• No separate superstructure (vimana); the rock itself is the roof
• Interior walls bear exquisite sculpted panels

Key Examples:
1. Mandagapattu (Villupuram) – First known structural temple dedicated to Brahma, Vishnu, and Shiva; inscription by Mahendravarman I mentions it was built without brick, mortar, timber, or metal
2. Mahishasuramardini Cave, Mahabalipuram – Famous for the sculptured panels of Vishnu in Anantasayana and Mahishasura Mardini
3. Varaha Cave, Mahabalipuram – Depicts Varaha avatar of Vishnu; elegant sculpted panels
4. Kotikal Mandapa, Mahabalipuram
5. Trichy Rockfort Upper Cave Temple – Dedicated to Shiva

Phase II – Monolithic Rock-Cut Rathas (Ratha Style):
Developed by Narasimhavarman I (Mamalla).

Characteristics:
• Monolithic structures carved from single granite boulders (one rock = one temple)
• No separate construction; entire shrine carved from rock
• Represent different architectural forms (apsidal, square, multi-storeyed)
• Demonstrate multiple regional architectural styles

Key Examples – Five Rathas (Pancha Pandava Rathas), Mahabalipuram:
1. Dharmaraja Ratha – Tallest; three-storeyed; square plan; octagonal shikhara
2. Bhima Ratha – Apsidal (oblong); wagon-roof (barrel vault) shaped top
3. Arjuna Ratha – Two-storeyed; square plan; similar to Dharmaraja but smaller
4. Nakula-Sahadeva Ratha – Apsidal with elephant; single storey
5. Draupadi Ratha – Smallest; hut-shaped roof; single cell

Also:
• Ganesha Ratha – Single-storeyed monolith
• Pidari Rathas (two smaller rathas)

Large bas-relief carvings – Arjuna's Penance (Descent of the Ganges), the world's largest open-air bas-relief at Mahabalipuram.

Phase III – Structural Stone Temples (Rajasimha Style):
Developed by Rajasimha (Narasimhavarman II) and later Pallava kings.

Characteristics:
• Fully constructed structural temples using cut granite blocks
• Emergence of vimana (tower over sanctum)
• Elaborate sculptural programmes on walls
• Early gopuram gateways
• Use of lion pillars (simha stambha) in mandapas
• Decorative scroll work and foliage patterns on pillars and walls

Key Examples:
1. Shore Temple, Mahabalipuram (700–728 CE) – Oldest structural stone temple in South India; twin shrines (Shiva + Vishnu); faces the sea; UNESCO World Heritage Site
2. Kailasanathar Temple, Kanchipuram (700–728 CE) – Finest example of Rajasimha style; sandstone construction; 58 small sub-shrines around the perimeter; intricate lion pillar carvings; earliest use of lion pilasters in Dravidian architecture
3. Vaikunta Perumal Temple, Kanchipuram (8th century CE) – Three-tiered vimana with circumambulatory passages at each level; narrative bas-relief panels depicting Pallava history

Sculptural Achievements:
• Pallava sculptors created magnificent narrative panels: Mahishasuramardini, Vishnu Anantasayana, Varaha, Arjuna's Penance
• Extremely detailed carving of figures, garments, jewellery
• Dvarpala (door guardians) became a standard feature of Dravidian temples

Legacy:
• Pallava architecture established the fundamental vocabulary of Dravidian temple architecture
• The ratha concept influenced later Chola vimana design
• The Shore Temple's location and scale directly inspired later Chola coastal shrines
• Mahabalipuram's monuments are a UNESCO World Heritage Site (1984)

Conclusion:
Pallava architectural achievements represent a glorious chapter in South Indian art history. From cave temples to monolithic rathas to grand structural shrines, the Pallavas systematically developed and perfected Dravidian temple architecture across three centuries, leaving an enduring legacy for all subsequent South Indian kingdoms.

Keywords: Pallava, rock-cut, ratha, Shore Temple, Kailasanathar, Mahabalipuram, Mahendravarman, Rajasimha, Dravidian, vimana`,
    answerTamil: `அறிமுகம்:
பல்லவ வம்சம் (கி.பி. 6–9ஆம் நூற்றாண்டு) தென்னிந்திய வரலாற்றில் கட்டடக்கலையின் மிகவும் படைப்பாற்றல் மிக்க மற்றும் செல்வாக்கு மிக்க ஆதரவாளர்களில் ஒன்றாகும். அவர்களின் கலை பங்களிப்புகள் திராவிட கோவில் கட்டடக்கலையின் தொடக்கத்தை குறிக்கின்றன.

பல்லவர் கட்டடக்கலையின் மூன்று கட்டங்கள்:
• முதல் கட்டம்: மகேந்திரவர்மன் பாணி (கி.பி. 610–640) – பாறையில் வெட்டிய குகைகள்
• இரண்டாம் கட்டம்: நரசிம்மவர்மன் பாணி (கி.பி. 640–674) – ஒரே கல் தேர்கள் மற்றும் பாறை நிவர்ண சிற்பங்கள்
• மூன்றாம் கட்டம்: ராஜசிம்மன் பாணி (கி.பி. 674–800) – கட்டுமான கல் கோவில்கள்

முதல் கட்டம் – குடைவரைக் கோவில்கள் (மண்டப பாணி):
மகேந்திரவர்மன் I ஆரம்பித்த பல்லவர்களின் ஆரம்பகால கட்டடக்கலை வடிவம்.

சிறப்பியல்புகள்:
• இயற்கையான பாறைகளில் நேரடியாக வெட்டிய கோவில்கள்
• சிங்க தூண் அடிகளுடன் (simha pilasters) எளிய முகப்புகள்
• யாளி அடிப்படையிலான தூண்கள்
• கட்டிடமான கட்டமைப்பு (விமானம்) இல்லை; பாறையே கூரை

முக்கிய எடுத்துக்காட்டுகள்:
1. மண்டகப்பட்டு – முதல் தெரிந்த கட்டுமான கோவில்; மகேந்திரவர்மன் I கல்வெட்டு செங்கல், சாந்து, மரம், உலோகம் இல்லாமல் கட்டப்பட்டது என குறிப்பிடுகிறது
2. மாமல்லபுரம் மகிஷாசுரமர்த்தினி குகை
3. மாமல்லபுரம் வராக குகை
4. திருச்சி கல்லணை கோவில்

இரண்டாம் கட்டம் – ஒற்றைக்கல் தேர்கள் (ரத பாணி):
நரசிம்மவர்மன் I (மாமல்லன்) உருவாக்கியது.

முக்கிய எடுத்துக்காட்டுகள் – பஞ்ச பாண்டவர் தேர்கள், மாமல்லபுரம்:
1. தர்மராஜ தேர் – மிக உயர்ந்தது; மூன்று மாடி; சதுர திட்டம்
2. பீம தேர் – நீள்வட்ட வடிவம்; வேகன் கூரை வடிவம்
3. அர்ஜுன தேர் – இரண்டு மாடி; சதுர திட்டம்
4. நகுல-சகாதேவ தேர் – நீள்வட்டம்; யானையுடன்
5. திரௌபதி தேர் – சிறியது; குடில் வடிவக் கூரை

மூன்றாம் கட்டம் – கட்டுமான கல் கோவில்கள் (ராஜசிம்மன் பாணி):

சிறப்பியல்புகள்:
• வெட்டிய கரடுமுரடான கல் தொகுதிகளால் கட்டப்பட்ட கோவில்கள்
• விமான கோபுரத்தின் தோற்றம்
• சுவர்களில் விரிவான சிற்ப திட்டங்கள்
• ஆரம்பகால கோபுர வாயில்கள்

முக்கிய எடுத்துக்காட்டுகள்:
1. கடற்கரைக் கோயில், மாமல்லபுரம் (கி.பி. 700–728) – தென்னிந்தியாவின் மிகவும் பழமையான கட்டுமான கல் கோவில்; யுனெஸ்கோ உலக பாரம்பரிய தளம்
2. கைலாசநாதர் கோவில், காஞ்சிபுரம் (கி.பி. 700–728) – ராஜசிம்மன் பாணியின் சிறந்த எடுத்துக்காட்டு; மணல்கல் கட்டுமானம்; 58 சிறிய துணை மண்டபங்கள்
3. வைகுண்ட பெருமாள் கோவில், காஞ்சிபுரம் (8ஆம் நூற்றாண்டு) – மூன்று அடுக்கு விமானம்; பல்லவ வரலாற்றை சித்தரிக்கும் சிற்பங்கள்

பல்லவர் கட்டடக்கலையின் பாரம்பரியம்:
• திராவிட கோவில் கட்டடக்கலையின் அடிப்படை வடிவங்களை நிறுவியது
• மாமல்லபுரம் நினைவுச்சின்னங்கள் 1984இல் யுனெஸ்கோ உலக பாரம்பரிய தளம் ஆனது

முடிவுரை:
பல்லவர் கட்டடக்கலை சாதனைகள் தென்னிந்திய கலை வரலாற்றில் ஒரு பெருமைமிக்க அத்தியாயத்தை பிரதிபலிக்கின்றன.

முக்கிய சொற்கள்: பல்லவர், குடைவரை, ரதம், கடற்கரைக் கோவில், கைலாசநாதர், மாமல்லபுரம், திராவிட பாணி, விமானம்`,
    keywordsEnglish: ["Pallava", "rock-cut", "ratha", "Shore Temple", "Kailasanathar", "Mahabalipuram", "Mahendravarman", "Rajasimha", "Dravidian", "vimana"],
    keywordsTamil: ["பல்லவர்", "குடைவரை", "ரதம்", "கடற்கரைக் கோவில்", "கைலாசநாதர்", "மாமல்லபுரம்", "திராவிட பாணி", "விமானம்"],
  },

  {
    unit: "Unit II", qNo: 17, marks: 16,
    questionEnglish: "Explain the hero stone worship tradition (Nadukkal worship system).",
    questionTamil: "நடுகல் வழிபாட்டு முறையை விளக்குக.",
    answerEnglish: `Introduction:
The hero stone tradition (நடுகல் வழிபாடு) is one of the most distinctive funerary and commemorative practices of ancient Tamil society. Hero stones (நடுகல் / வீரக்கல்) are memorial stones erected in honor of warriors who died heroically in battle or while protecting cattle, village, or king. The tradition is extensively documented in Sangam literature and confirmed by numerous archaeological discoveries across Tamil Nadu.

Definition and Purpose:
A hero stone is a commemorative pillar or slab of stone erected at a public place to honor a fallen warrior. It serves as:
1. A memorial to the hero's bravery
2. An object of religious worship (the hero becomes a deity after death)
3. A public record of the warrior's deeds
4. A social honor bestowed by the community

Literary Sources:
• Tholkappiyam (Purathinaiyiyal) – Describes six stages of hero stone installation
• Purananuru – Many poems celebrate warriors and their memorial stones
• Akananuru – References to Nadukkal worship
• Silappadikaram – Mentions hero stone worship traditions
• Manimekalai – References to the practice

Six Stages of Hero Stone Installation (as per Tholkappiyar):
1. Kalloṇdu Koṇdal (கல்லொண்டு கொண்டல்) – Selecting a suitable, unblemished stone of appropriate size
2. Neerāttudal (நீராட்டுதல்) – Ritually bathing the stone in pure water; consecrating it
3. Niddal (நிட்டல்) – Fixing/erecting the stone firmly in an upright position at a public place
4. Peyar Paraitthal (பெயர் பரைத்தல் / சாதனை பொறித்தல்) – Inscribing the warrior's name, deeds, the battle, the king served, and the village
5. Vaazhththudal (வாழ்த்துதல்) – Worshipping the stone as a divine deity; performing rituals
6. Vilavu (விழா) – Conducting festivals and periodic worship at the hero stone

Iconographic Features of Hero Stones:
Hero stones typically depict the warrior's story in carved panels from bottom to top:
• Bottom panel – The battle scene (the warrior fighting or being wounded/killed)
• Middle panel – The warrior being carried to heaven; women in grief (Ayamana posture)
• Top panel – The warrior in heaven (svarga/paradise) — often shown seated with celestial beings
• Some stones show the warrior holding weapons, with inscriptions in Tamil Brahmi or Tamil script

Archaeological Evidence from Tamil Nadu:
• Adichanallur – Among the earliest evidence of hero commemoration
• Pulankurichi (Tirunelveli) – Large hero stone with Tamil Brahmi inscription
• Amaravati – Hero stone with detailed narrative panels
• Srirangam, Madurai, Trichy – Medieval hero stones in temple complexes
• Muziri (Kodungallur, Kerala) – Hero stones with Sangam-era inscriptions

Distribution:
Hero stones are found across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh, indicating a shared cultural tradition across the Dravidian-speaking world.

Worship Practices:
1. The hero stone becomes a village deity (kaval deivam – காவல் தெய்வம்)
2. Annual festivals (விழா) are held at the stone with offerings
3. Women in grief perform prescribed rituals (ayamana – ஆயமன நிலை)
4. The stone is worshipped as protector of the village
5. Flowers, food, and oil lamps are offered
6. The hero's memorial is recited and sung by Panar (bards)

Social Significance:
1. Hero stones reflect a society that highly valued martial bravery and self-sacrifice
2. They served as role models inspiring younger warriors
3. The public nature of the stones reinforced community values of courage and loyalty to king and people
4. Cattle raids (வெட்சி tiṇai) were specifically mentioned, indicating the economic importance of cattle in warrior culture

Evolution of the Tradition:
• Sangam period (c. 300 BCE–300 CE): Simple stones with basic inscriptions
• Early medieval period (5th–9th CE): More elaborate sculptural programs
• Later medieval period (10th–17th CE): Hero stones incorporated into temple complexes
• Post-medieval: Practice gradually declined but traces survive in folk worship traditions

Conclusion:
The Nadukkal tradition embodies the Tamil concept of heroic death (வீர மரணம்) as the highest form of sacrifice. The elaborate six-stage installation and worship system transformed the fallen warrior into a protective divinity, ensuring both personal immortality and community safety. This tradition is a unique contribution of ancient Tamil civilization to world heritage.

Keywords: Nadukkal, hero stone, Tholkappiyar, six stages, Tamil Brahmi, warrior worship, Purananuru, vira maranam`,
    answerTamil: `அறிமுகம்:
நடுகல் வழிபாடு பண்டைய தமிழ் சமூகத்தின் மிகவும் தனித்துவமான இடுகாட்டு மற்றும் நினைவிடால் நடைமுறைகளில் ஒன்றாகும். நடுகல்கள் (வீரக்கல்கள்) போரில் வீரமரணமடைந்த அல்லது கால்நடைகளை, கிராமத்தை அல்லது அரசனை பாதுகாக்கும்போது உயிரை இழந்த வீரர்களை கௌரவிக்க நடப்பட்ட நினைவுக்கற்கள் ஆகும்.

வரையறை மற்றும் நோக்கம்:
நடுகல் என்பது பொது இடத்தில் வீரர் வீழ்ந்ததை கௌரவிக்க நடப்பட்ட நினைவுத் தூண் அல்லது கல் தட்டு. இது:
1. வீரனின் தைரியத்திற்கான நினைவிடம்
2. மத வழிபாட்டு பொருள் (வீரன் இறப்புக்கு பின் தெய்வமாகிறான்)
3. வீரனின் சாதனைகளின் பொது பதிவு
4. சமூகம் வழங்கும் சமூக கௌரவம்

இலக்கிய ஆதாரங்கள்:
• தொல்காப்பியம் (புறத்திணையியல்) – நடுகல் நட்பதற்கான ஆறு நிலைகளை விவரிக்கிறது
• புறநானூறு – வீரர்களையும் அவர்களின் நினைவுக்கற்களையும் பல கவிதைகள் போற்றுகின்றன
• சிலப்பதிகாரம் – நடுகல் வழிபாட்டு பாரம்பரியங்களை குறிப்பிடுகிறது

தொல்காப்பியர் குறிப்பிடும் ஆறு நிலைகள்:
1. கல்லொண்டு கொண்டல் – பொருத்தமான கல்லை தேர்ந்தெடுப்பு
2. நீராட்டுதல் – கல்லை சடங்கு முறையில் நீரில் குளிப்பாட்டி புனிதப்படுத்துதல்
3. நிட்டல் – பொது இடத்தில் கல்லை நிலைநாட்டுதல்
4. பெயர் பரைத்தல் – வீரனின் பெயர், சாதனைகள், போர், சேவை செய்த அரசன் பொறித்தல்
5. வாழ்த்துதல் – கல்லை தெய்வமாக வழிபடுதல்; சடங்குகள் நிறைவேற்றல்
6. விழா – நடுகலில் திருவிழாக்கள் மற்றும் தொடர் வழிபாடு நடத்துதல்

நடுகல்லின் சிற்ப அம்சங்கள்:
• கீழ்ப்பகுதி – போர்க்காட்சி (வீரன் போரிடும் அல்லது காயப்படும் காட்சி)
• நடுப்பகுதி – வீரன் சொர்க்கத்திற்கு கொண்டு செல்லப்படுதல்; பெண்களின் துக்கம் (ஆயமன நிலை)
• மேற்பகுதி – வீரன் சொர்க்கத்தில் (தேவர்களுடன் அமர்ந்திருக்கும் காட்சி)

தமிழகத்தில் தொல்லியல் சான்றுகள்:
• புலங்குறிச்சி (திருநெல்வேலி) – தமிழ் பிராமி கல்வெட்டுடன் பெரிய நடுகல்
• சிரீரங்கம், மதுரை, திருச்சி – கோவில் வளாகங்களில் இடைக்கால நடுகற்கள்

வழிபாட்டு நடைமுறைகள்:
1. நடுகல் கிராம தெய்வமாகிவிடுகிறது (காவல் தெய்வம்)
2. கல்லில் ஆண்டுதோறும் விழாக்கள் நடைபெறுகின்றன
3. பூக்கள், உணவு, எண்ணெய் தீபங்கள் படைக்கப்படுகின்றன
4. பாணர் வீரனின் கதையை பாடுவர்

சமூக முக்கியத்துவம்:
1. நடுகற்கள் போர் வீரத்தையும் தியாகத்தையும் மிகவும் மதிக்கும் சமூகத்தை பிரதிபலிக்கின்றன
2. இளைய வீரர்களுக்கு முன்மாதிரியாக செயல்பட்டன
3. வீட்சி திணை – கால்நடை கொள்ளை, கால்நடைகளின் பொருளாதார முக்கியத்துவத்தை காட்டுகிறது

முடிவுரை:
நடுகல் வழிபாடு தமிழரின் வீர மரண கருத்தை (உயர்ந்த தியாக வடிவம்) பொதிந்திருக்கிறது. ஆறு நிலை நடவடிக்கை வீழ்ந்த வீரனை பாதுகாப்பு தெய்வமாக மாற்றி, தனிப்பட்ட அழியாமை மற்றும் சமூக பாதுகாப்பை உறுதி செய்தது.

முக்கிய சொற்கள்: நடுகல், தொல்காப்பியர், ஆறு நிலைகள், தமிழ் பிராமி, வீர வழிபாடு, புறநானூறு, வீர மரணம்`,
    keywordsEnglish: ["Nadukkal", "hero stone", "Tholkappiyar", "six stages", "Tamil Brahmi", "warrior worship", "Purananuru"],
    keywordsTamil: ["நடுகல்", "தொல்காப்பியர்", "ஆறு நிலைகள்", "தமிழ் பிராமி", "வீர வழிபாடு", "வீர மரணம்"],
  },

  {
    unit: "Unit II", qNo: 18, marks: 16,
    questionEnglish: "Discuss the stage construction methods mentioned in Silappadikaram.",
    questionTamil: "சிலப்பதிகாரத்தில் குறிப்பிடப்படும் மேடை அமைப்பு முறைகள் குறித்து விளக்குக.",
    answerEnglish: `Introduction:
Silappadikaram (சிலப்பதிகாரம்), composed by Ilango Adigal around the 2nd–5th century CE, is one of the great Tamil epics and a rich source of information about ancient Tamil urban life, festivals, architecture, and performance traditions. The epic vividly describes elaborate stage structures (மேடை/அரங்கு) built for public performances, royal audiences, and festival events.

Overview of Stage Construction in Silappadikaram:
The epic describes various types of platforms, halls, and stages used for dance, music, theatrical performance, royal proclamations, and public gatherings. These descriptions reveal sophisticated understanding of spatial design, acoustics, and audience management in ancient Tamil cities like Puhar (Kaveripoompattinam), Madurai, and Vanji.

Types of Stage Structures Described:

1. Kotimara Kottam (கொடிமரக் கோட்டம்) – Flagstaff Courtyard:
• Elevated platform for public announcements and royal proclamations
• Surrounded by open space for gathering citizens
• A flagstaff (கொடிமரம்) was the central feature, signaling the presence of authority

2. Arangam (அரங்கம்) – Performance Stage:
• A formal, elevated stage for dance (classical Bharatanatyam) and music performances
• Described as having defined spatial zones: stage (அரங்கு), orchestra pit (பக்க இசை), and audience area
• The Arangam described in the Arangettru Kaadai (Stage Debut) chapter shows specific ritual procedures for inaugurating a performance space

Key Features of Arangam (Stage Debut chapter – Arangettru Kaadai):
• The stage was purified with sacred rituals before Kannagi and Kovalan's story unfolds
• The guru (dance teacher/nattuvanar) consecrates the stage with offerings
• Specific spatial arrangement: the natuvam (நடுவம் – center stage), wings, and back area
• Lamp arrangements providing stage lighting
• The concept of facing East during performances (auspicious direction)

3. Mandapam (மண்டபம்) – Ceremonial Hall:
• Enclosed or semi-enclosed hall for royal audiences, festivals, and assemblies
• Pillared structure with decorated entablatures
• Types mentioned: dance mandapam, music mandapam, royal mandapam
• Elevated platforms within for performers and royalty

4. Saalai (சாலை) – Long Halls/Exhibition Spaces:
• Long, linear structures used for displaying goods, hosting merchants, or public activities
• References to artisan saalais and entertainment saalais in Puhar's urban plan

5. Anthapura Arangam (அந்தப்பூர அரங்கம்) – Inner Court Stage:
• Performance space within the women's quarters of the royal palace
• Smaller, intimate stage for private royal entertainment
• Elaborate decorations with flowers, lamps, and fragrant water

Construction Materials and Methods:
• Stone platforms (கல் மேடை) for permanent stages
• Timber and bamboo frameworks for temporary festival stages
• Pillars of stone or timber supporting roofs over performance spaces
• Thatched, tiled, or flat stone roofing
• Floor finishing with lime plaster (chunnam) – polished, smooth surface
• Decorations with garlands, lamp stands, and paintings on walls

Acoustic and Spatial Design Principles:
• Performance spaces oriented to allow natural sound projection
• Semi-circular or rectangular audience seating arrangements
• Stage elevation so all audience members could see
• Wings and back-stage areas for performers to await entry
• Special acoustic walls described using curved surfaces to project sound

Ritual Aspects of Stage Construction:
1. Site selection based on auspicious alignment
2. Foundation ritual (பூமிபூஜை) before construction
3. Purification of the completed space with sacred water and fire
4. First performance dedicated to the deity (Murugan or Shiva)
5. Inauguration rites performed by the principal performer and guru

Urban Planning Context (Puhar City):
Silappadikaram's Puhar (Kaveripoompattinam) is described as a planned city with:
• Separate quarters for different occupations (artisans, merchants, nobility)
• Public spaces with mandapams for festivals
• Royal palace complex with multiple performance courts
• Coastal city features: harbor, warehouses, merchant streets

Legacy:
The stage construction principles described in Silappadikaram influenced:
• Classical Tamil theatre (Koothu, Terukkoothu)
• Temple theater traditions
• Later Kerala Kutiyattam performance space design
• Modern interpretations in Tamil performing arts centers

Conclusion:
Silappadikaram provides a uniquely detailed picture of ancient Tamil performance architecture. The elaborate stage structures, their ritual consecration, acoustic design, and audience management principles described in the epic demonstrate that ancient Tamils had developed sophisticated performance spaces comparable to theatres found in other great ancient civilizations.

Keywords: Silappadikaram, Arangam, Mandapam, stage construction, Puhar, Kaveripoompattinam, performance space, Arangettru Kaadai`,
    answerTamil: `அறிமுகம்:
சிலப்பதிகாரம் (இளங்கோ அடிகள் இயற்றியது) கி.பி. 2–5ஆம் நூற்றாண்டில் இயற்றப்பட்டது. இது பண்டைய தமிழ் நகர வாழ்க்கை, திருவிழாக்கள், கட்டடக்கலை மற்றும் நிகழ்ச்சி பாரம்பரியங்கள் பற்றிய பொக்கிஷமான தகவல்களை கொண்ட சங்க காலத்திற்கு பிந்தைய முக்கிய இலக்கியம்.

சிலப்பதிகாரத்தில் மேடை அமைப்பு:
காவியம் நாட்டிய, இசை நிகழ்ச்சிகள், அரசவை, மற்றும் பொது கூட்டங்களுக்கு பயன்படுத்தப்பட்ட பல வகையான மேடைகள் மற்றும் மண்டபங்களை விவரிக்கிறது.

விவரிக்கப்படும் மேடை வகைகள்:

1. கொடிமரக் கோட்டம்:
• பொது அறிவிப்புகள் மற்றும் அரசவை கட்டளைகளுக்கான உயர்த்தப்பட்ட மேடை
• குடிமக்கள் ஒன்று திரள திறந்தவெளியால் சூழப்பட்டது
• கொடிமரம் அதிகாரத்தின் இருப்பை அறிவிக்கும் மையப் பகுதி

2. அரங்கம் – நிகழ்ச்சி மேடை:
• நாட்டிய மற்றும் இசை நிகழ்ச்சிகளுக்கான முறையான, உயர்த்தப்பட்ட மேடை
• வரையறுக்கப்பட்ட இடவியல் மண்டலங்கள்: மேடை (அரங்கு), இசை இடம் (பக்க இசை), பார்வையாளர் பகுதி
• அரங்கேற்றம் காட்டை அத்தியாயம் மேடை திறப்பதற்கான குறிப்பிட்ட சடங்கு நடைமுறைகளை காட்டுகிறது

அரங்கேற்றம் காட்டை (மேடை அறிமுக அத்தியாயம்) முக்கிய அம்சங்கள்:
• குரு (நட்டுவனார்) படைப்புகளுடன் மேடையை புனிதப்படுத்துகிறார்
• குறிப்பிட்ட இடவியல் அமைப்பு: நடுவம் (மையமேடை), சிறகுகள், பின்புற பகுதி
• மேடை வெளிச்சம் வழங்கும் விளக்கு அமைப்புகள்
• நிகழ்ச்சியின்போது கிழக்கு திசை பார்க்கும் கருத்தியல் (மங்கல திசை)

3. மண்டபம் – சடங்கு மண்டபம்:
• அரசவை, திருவிழாக்கள் மற்றும் கூட்டங்களுக்கான மண்டபம்
• அலங்கரிக்கப்பட்ட தூண் கட்டமைப்பு
• வகைகள்: நாட்டிய மண்டபம், இசை மண்டபம், அரசவை மண்டபம்

4. சாலை – நீண்ட மண்டபங்கள்:
• பொருட்களை காட்சிப்படுத்துவதற்கும் வணிகர்களை வழங்குவதற்கும் நீண்ட, நேரியல் கட்டமைப்புகள்
• புகாரின் நகர திட்டமிடலில் கைவினைஞர் சாலைகள் மற்றும் பொழுதுபோக்கு சாலைகள் குறிப்புகள்

கட்டுமான பொருட்கள் மற்றும் முறைகள்:
• நிரந்தர மேடைகளுக்கு கல் மேடைகள்
• திருவிழா தற்காலிக மேடைகளுக்கு மரம் மற்றும் மூங்கில் சட்டங்கள்
• சுண்ணாம்புகுழைவால் தயாரிக்கப்பட்ட மெருகூட்டப்பட்ட தரை

ஒலி மற்றும் இட வடிவமைப்பு கொள்கைகள்:
• இயற்கை ஒலி திட்டத்தை அனுமதிக்கும் நோக்குநிலை
• அரை வட்ட அல்லது செவ்வக பார்வையாளர் இருக்கை அமைப்பு
• அனைத்து பார்வையாளர்களும் பார்க்கும் வகையில் மேடை உயரம்

மேடை கட்டுமானத்தின் சடங்கு அம்சங்கள்:
1. மங்கலமான திசையில் தள தேர்வு
2. கட்டுமானத்திற்கு முன் பூமிபூஜை
3. புனித நீர் மற்றும் நெருப்பால் முடிந்த மேடையை தூய்மைப்படுத்தல்
4. தெய்வத்திற்கு அர்ப்பணிக்கப்பட்ட முதல் நிகழ்ச்சி

முடிவுரை:
சிலப்பதிகாரம் பண்டைய தமிழ் நிகழ்ச்சி கட்டடக்கலையை பற்றிய தனித்துவமான விரிவான படத்தை வழங்குகிறது. விரிவான மேடை கட்டமைப்புகள், அவற்றின் சடங்கு புனிதப்படுத்தல் மற்றும் ஒலி வடிவமைப்பு கொள்கைகள் பண்டைய தமிழர்கள் மேம்பட்ட நிகழ்ச்சி இடங்களை உருவாக்கியிருந்தனர் என்பதை நிரூபிக்கின்றன.

முக்கிய சொற்கள்: சிலப்பதிகாரம், அரங்கம், மண்டபம், மேடை கட்டுமானம், புகார், அரங்கேற்றம் காட்டை`,
    keywordsEnglish: ["Silappadikaram", "Arangam", "Mandapam", "stage construction", "Puhar", "Arangettru Kaadai", "performance space"],
    keywordsTamil: ["சிலப்பதிகாரம்", "அரங்கம்", "மண்டபம்", "மேடை கட்டுமானம்", "புகார்", "அரங்கேற்றம் காட்டை"],
  },

  {
    unit: "Unit II", qNo: 19, marks: 16,
    questionEnglish: "Describe the grand temples and other worship sites of the Chola period.",
    questionTamil: "சோழர் காலத்துப் பெருங்கோயில்கள் மற்றும் பிற வழிபாட்டு தலங்களைப் பற்றி விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
The Chola dynasty (9th–13th century CE) represents the golden age of South Indian temple architecture. The Cholas were prolific temple builders who elevated Dravidian architecture to its most refined and monumental form. Their temples were not merely places of worship but also centers of economic, social, cultural, and political activity.

Overview of Chola Temple Architecture:
Chola temples are characterized by the following:
• Massive vimana (tower above sanctum) in the shape of a pyramidal spire
• Elaborately decorated gopurams (gateway towers)
• Large prakara (enclosure walls with multiple circumambulatory passages)
• Extensive mandapams (pillared halls) for different activities
• Sophisticated hydraulic systems (temple tanks)
• Integration of royal iconography with religious sculpture

The Great Living Chola Temples (UNESCO World Heritage, 1987):

1. Brihadeeswara Temple, Thanjavur (1010 CE):
Built by: Raja Raja Chola I (985–1014 CE)
Deity: Lord Shiva (Brihadeeswara / Peruvudaiyar)
Key Features:
• Vimana height: 66 metres (216 feet) — tallest Chola vimana
• The Nandi (sacred bull) statue at the entrance is 6 metres long and 3.7 metres high, carved from a single granite block
• The shadow of the main vimana never falls on the ground (engineering marvel)
• The circumambulatory passage contains 250 Shivalingams
• Outer walls have fresco paintings (Chola period) depicting Shiva legends
• The temple was called Dakshina Meru (Southern Mount Meru)
• Inscription called Rajarajesvaram inscribed by Raja Raja I records construction details

2. Gangaikonda Cholapuram Temple (1025–1035 CE):
Built by: Rajendra Chola I to commemorate his northern military campaigns
Deity: Lord Shiva (Gangaikonda Choleswarar)
Key Features:
• Vimana height: 55 metres — slightly concave curvature compared to Thanjavur's straight profile
• The temple was the capital city temple of the new capital Gangaikonda Cholapuram
• Large Chola Bronze treasury (Nataraja, Ardhanarishvara, etc.)
• A large tank named Cholagangam (said to contain Ganges water brought by Rajendra Chola from North India)
• Brilliant sculptural panels of Saraswati, Durga (Mahishasuramardhini), Chandeshanugrahamurthi

3. Airavateswarar Temple, Darasuram (12th century CE):
Built by: Raja Raja Chola II
Deity: Lord Shiva (Airavateswarar)
Key Features:
• Smaller in scale but exquisitely detailed sculptural program
• The temple entrance is in the form of a huge chariot (ratha) with wheels
• The mandapam steps make musical notes when struck
• Fine bas-relief sculptures on outer walls depicting Shiva stories
• Well-preserved Chola frescoes inside

Other Important Chola Worship Sites:

4. Nataraja Temple, Chidambaram:
• The cosmic dance of Shiva is enshrined here
• Cholas patronized this temple extensively
• Gold-plated gopurams added during Chola period
• Five sacred halls (Panchesabhai) — Chidambaram is the Kanaka (Gold) Sabha

5. Sriranganathaswamy Temple, Srirangam:
• Largest functioning temple complex in India
• Cholas built several mandapams and gopurams
• The famous Rajagopuram (completed later in 20th century) rises 73 metres
• Seven concentric prakarams (enclosure walls)

6. Sarangapani Temple, Kumbakonam:
• A major Vaishnava temple patronized by Cholas
• Tall gopuram with elaborately sculpted figures

7. Rock-cut Temples and Shrines:
• While the Pallavas were the pioneers of rock-cut architecture, early Chola rulers also patronized cave shrines
• Cave temple at Kunnattur (Villupuram) attributed to early Cholas

Temple Economy and Administration:
• Temples were major economic institutions: they owned vast land, received donations of gold, cattle, and revenue
• Temple staff included priests (shivabrahmins), musicians, dancers (devadasis), accountants, gardeners, guards
• Chola inscriptions record detailed temple land records and endowment accounts
• The village assembly (sabha) was often associated with temple management

Sculptural Program of Chola Temples:
• Chola bronze casting (Panchaloha – five-metal alloy) produced world-famous sculptures
• Famous bronzes: Nataraja (Dancing Shiva), Uma-Maheshwara, Devi Parvati
• These are now in major world museums (British Museum, Metropolitan Museum)
• Stone sculptures on temple walls: Dvarapalas, Vyalas (mythical beasts), Apsaras, Devasena

Conclusion:
The Chola temple tradition represents one of humanity's greatest architectural achievements. These living temples — still active after nearly a thousand years — embody the synthesis of art, architecture, religion, economy, and governance that defined Chola civilization at its peak.

Keywords: Brihadeeswara, Gangaikonda Cholapuram, Airavateswarar, Nataraja, Raja Raja Chola, UNESCO, Chola bronze, vimana, gopuram`,
    answerTamil: `அறிமுகம்:
சோழ வம்சம் (கி.பி. 9–13ஆம் நூற்றாண்டு) தென்னிந்திய கோவில் கட்டடக்கலையின் பொற்காலத்தை பிரதிநிதித்துவப்படுத்துகிறது. சோழர்கள் திராவிட கட்டடக்கலையை மிகவும் செம்மையான மற்றும் மகத்தான வடிவத்திற்கு உயர்த்தினர்.

சோழர் கோவில் கட்டடக்கலையின் சிறப்பியல்புகள்:
• கருவறை மேல் பிரமிட் வடிவ விமான கோபுரம்
• விரிவாக அலங்கரிக்கப்பட்ட கோபுரம்
• பெரிய பிரகாரங்கள் (சுற்று மதில்கள்)
• பல்வேறு செயல்பாடுகளுக்கான விரிவான மண்டபங்கள்
• நுணுக்கமான நீர்ப்பாசன அமைப்புகள் (கோவில் குளங்கள்)

பெரிய வாழும் சோழர் கோவில்கள் (யுனெஸ்கோ உலக பாரம்பரியம், 1987):

1. பிரகதீஸ்வரர் கோவில், தஞ்சாவூர் (கி.பி. 1010):
கட்டியவர்: ராஜராஜ சோழன் I (கி.பி. 985–1014)
தெய்வம்: சிவன் (பிரகதீஸ்வரர்/பெருவுடையார்)
முக்கிய அம்சங்கள்:
• விமான உயரம்: 66 மீட்டர் (216 அடி) – மிக உயர்ந்த சோழர் விமானம்
• நந்தி சிலை 6 மீட்டர் நீளம், ஒரே கல்லில் செய்யப்பட்டது
• பிரதான விமானத்தின் நிழல் தரையில் விழாத பொறியியல் அதிசயம்
• தட்சிண மேரு என்று அழைக்கப்பட்டது
• ராஜராஜேஸ்வரம் என்று கல்வெட்டில் பதிவு

2. கங்கைகொண்ட சோழபுரம் கோவில் (கி.பி. 1025–1035):
கட்டியவர்: ராஜேந்திர சோழன் I
தெய்வம்: சிவன் (கங்கைகொண்ட சோளேஸ்வரர்)
முக்கிய அம்சங்கள்:
• விமான உயரம்: 55 மீட்டர் – சற்று குழி வளைவுடன்
• புது தலைநகர் கோவில்
• சோழகங்கம் என்ற பெரிய குளம் (வடக்கிலிருந்து கொண்டுவந்த கங்கா நீர் என்று கருதப்படுகிறது)
• சரஸ்வதி, துர்கா, சந்தேஸனுக்ரஹமூர்த்தி சிறந்த சிற்ப பலகைகள்

3. ஐராவதேஸ்வரர் கோவில், தாரசுரம் (கி.பி. 12ஆம் நூற்றாண்டு):
கட்டியவர்: ராஜராஜ சோழன் II
தெய்வம்: சிவன் (ஐராவதேஸ்வரர்)
முக்கிய அம்சங்கள்:
• சிறிய அளவில் அழகிய சிற்பங்கள்
• கோவில் நுழைவாயில் மிகப்பெரிய தேர் (ரதம்) வடிவத்தில்
• மண்டப படிகள் தட்டும்போது இசை வடிவங்கள் உண்டாக்கும்

4. நடராஜர் கோவில், சிதம்பரம்:
• சிவனின் பிரபஞ்ச நடனம் (நடராஜர்) இங்கு குடிகொண்டுள்ளது
• சோழர்கள் இந்த கோவிலை பெரிதும் ஆதரித்தனர்
• கனக சபை (தங்க சபை) – ஐந்து திருக்குறிகோயில்களில் ஒன்று

5. ஸ்ரீரங்கநாதசுவாமி கோவில், சிரீரங்கம்:
• இந்தியாவின் மிகப்பெரிய இயங்கும் கோவில் வளாகம்
• ராஜகோபுரம் 73 மீட்டர் உயரம்
• ஏழு சுற்று பிரகாரங்கள்

கோவில் பொருளாதாரம் மற்றும் நிர்வாகம்:
• கோவில்கள் பெரிய பொருளாதார நிறுவனங்கள்: பரந்த நிலம் வைத்திருந்தன, தங்கம், மாடு, வருவாய் நன்கொடைகள் பெற்றன
• கோவில் பணியாளர்கள்: குருக்கள், இசைவாணர்கள், நர்த்தகிகள் (தேவதாசிகள்), கணக்காளர்கள்

சோழர் சிற்பங்கள்:
• பஞ்சலோக சோழர் வெண்கல சிற்பங்கள் உலகப் பிரசித்தி பெற்றவை
• நடராஜர் (நடனம் செய்யும் சிவன்), உமா-மகேஸ்வரர், தேவி பார்வதி
• இவை இப்போது உலகின் முக்கிய அருங்காட்சியகங்களில் உள்ளன

முடிவுரை:
சோழர் கோவில் மரபு மனிதகுலத்தின் மிகப்பெரிய கட்டடக்கலை சாதனைகளில் ஒன்றை பிரதிநிதித்துவப்படுத்துகிறது.

முக்கிய சொற்கள்: பிரகதீஸ்வரர், கங்கைகொண்ட சோழபுரம், ஐராவதேஸ்வரர், நடராஜர், ராஜராஜ சோழன், யுனெஸ்கோ, சோழர் வெண்கலம், விமானம், கோபுரம்`,
    keywordsEnglish: ["Brihadeeswara", "Gangaikonda Cholapuram", "Airavateswarar", "Nataraja", "Raja Raja Chola", "UNESCO", "Chola bronze", "vimana", "gopuram"],
    keywordsTamil: ["பிரகதீஸ்வரர்", "கங்கைகொண்ட சோழபுரம்", "ஐராவதேஸ்வரர்", "நடராஜர்", "ராஜராஜ சோழன்", "யுனெஸ்கோ", "விமானம்"],
  },
  {
    unit: "Unit II", qNo: 20, marks: 16,
    questionEnglish: "Explain the distinctive features of Chettinad house architecture.",
    questionTamil: "செட்டிநாடு வீடுகளின் கட்டடக்கலையின் சிறப்புகளைக்கூறுக.",
    answerEnglish: `Introduction:
Chettinad (செட்டிநாடு) is a region in Sivaganga district of Tamil Nadu inhabited by the Nattukotai Chettiar (நாட்டுக்கோட்டை செட்டியார்) community, who were prosperous merchants and bankers known for their trade links across Southeast Asia. Their prosperity is most visibly expressed in the magnificent mansions they built — often called Chettinad palaces — which represent one of India's most distinctive and lavish regional architectural traditions.

Historical Background:
• Nattukotai Chettiars accumulated great wealth from 18th–20th centuries through trade in Burma (Myanmar), Ceylon (Sri Lanka), Malaya, and Southeast Asia
• This wealth was invested in building elaborate mansions in their home villages
• Major Chettinad villages: Karaikudi, Kanadukathan, Devakottai, Pallathur, Kottaiyur
• Construction peak: Late 19th century to early 20th century (1860–1940 CE)
• After Indian independence (1947), the trading networks declined and many mansions are now abandoned or heritage properties

Layout and Spatial Organization:
A typical Chettinad mansion follows a highly ordered spatial progression from public to private:

1. Thinnai (திண்ணை) – Raised Verandah:
• Open front platform, raised above street level
• Used for receiving visitors, informal gatherings, and air circulation
• Characteristic feature visible from the street; often has two columns or pillars

2. Nattu Kottai (நட்டுக்கோட்டை) – Outer Courtyard:
• First open courtyard inside the main entrance
• Used for public receptions and ceremonies
• Surrounded by rooms for guests and formal meetings

3. Valavu (வளவு) – Inner Courtyard:
• The central open courtyard; heart of the house
• Used for family ceremonies: weddings, funerals, festivals
• Rooms arranged around it on all four sides
• Often has a well or water feature

4. Kitchen Area and Rear Courtyard:
• Separate zone for cooking and women's activities
• Multiple storage rooms for grains and goods
• Usually the most private area of the house

Architectural Features:

Construction Materials (imported from Southeast Asia and globally):
• Burmese teak (பர்மா தேக்கு) – for doors, frames, pillars, ceiling beams
• Italian marble – for floors of main halls and courtyards
• Belgian glass mirrors – embedded in walls and above doors
• Athangudi tiles (அத்தாங்குடி ஓடு) – handmade colored cement tiles unique to Chettinad; geometric patterns in vibrant red, green, blue
• Lime plaster (சுண்ணாம்பு சாந்து with egg whites, jaggery, and shell lime) – for polished walls

Structural Elements:
• Pillars – carved from single blocks of stone or Burmese teak; decorated with vines, lotus, and mythological motifs
• Carved wooden doors (கதவு வேலைப்பாடு) – often 6–8 feet wide, elaborately carved with floral and narrative patterns; some doors have two or three layers
• Nattu kattai threshold (நட்டுக்கட்டை) – carved threshold pieces at entrances
• High ceilings – 15–25 feet high, allowing air circulation in the hot climate

Decorative Features:
1. Stucco plasterwork (சுண்ணாம்பு கலை வேலைப்பாடு):
• Intricate floral, bird, and mythological designs on exterior and interior walls
• Finished with egg white, jaggery, and shell lime for strength and sheen
• Color: white exterior contrasting with patterned color tiled floors

2. Athangudi Tiles:
• Handmade tiles from Athangudi village (near Karaikudi)
• Made with colored cement and natural pigments
• Geometric, floral, and abstract patterns
• Known for durability and natural cooling property

3. Pillars and Brackets:
• Carved granite or wood pillars with lion, elephant, and floral motifs
• Decorated load-bearing brackets (உத்திரம்) between pillars and beams

4. Ornamentation with Imported Materials:
• Belgian cut-glass chandeliers
• European ceramic tiles in kitchen and bathrooms
• Silver and brass ritual objects integrated into architecture
• Windows and ventilators with decorative iron grille patterns

Climate Responsiveness:
• High ceilings create convective cooling (stack effect)
• Central courtyards allow natural light and cross-ventilation
• Thick walls provide thermal mass (remain cool in summer)
• Athangudi tiles naturally cool underfoot
• Traditional tank (குளம்) in the courtyard moderates microclimate

Symbolism and Social Expression:
• Size and elaborateness of mansion reflected family wealth and status
• Large thinnai expressed hospitality (a core Chettiar value)
• The central valavu was the social heart of family life

Contemporary Status and Preservation:
• Many mansions abandoned after 1947; some converted to hotels (Visalam, Bangala, Chidambara Vilas)
• Government Tamil Nadu Tourism promotes Chettinad heritage tourism
• Private heritage conservation projects
• Athangudi tile craft maintained as a cottage industry

Conclusion:
Chettinad mansions represent a unique confluence of South Indian tradition, Southeast Asian luxury materials, and European decorative elements. Their spacious courtyards, hand-crafted tiles, carved wooden doors, and stucco artwork make them one of India's most remarkable examples of merchant-community architecture.

Keywords: Chettinad, Nattukotai Chettiar, Athangudi tiles, Burmese teak, thinnai, valavu, stucco, Italian marble, heritage architecture`,
    answerTamil: `அறிமுகம்:
செட்டிநாடு தமிழ்நாட்டின் சிவகங்கை மாவட்டத்தில் உள்ள ஒரு பகுதியாகும். இங்கு வாழும் நாட்டுக்கோட்டை செட்டியார் சமூகத்தினர் தென்கிழக்கு ஆசியா முழுவதும் வணிக தொடர்புகள் கொண்டவர்கள். அவர்களின் செல்வம் அவர்கள் கட்டிய கம்பீரமான மாளிகைகளில் மிகத் தெளிவாக வெளிப்படுகிறது.

வரலாற்றுப் பின்னணி:
• நாட்டுக்கோட்டை செட்டியார்கள் 18–20ஆம் நூற்றாண்டில் பர்மா, இலங்கை, மலேயா வழியாக பெரும் செல்வம் திரட்டினார்கள்
• இந்த செல்வம் தங்கள் சொந்த கிராமங்களில் விரிவான மாளிகைகள் கட்டுவதில் முதலீடு செய்யப்பட்டது
• முக்கிய செட்டிநாடு கிராமங்கள்: கரைக்குடி, கனடுகாத்தான், தேவகோட்டை
• கட்டுமான உச்சம்: கி.பி. 19ஆம் நூற்றாண்டு இறுதி முதல் 20ஆம் நூற்றாண்டு ஆரம்பம்

வீட்டின் வடிவமைப்பு மற்றும் இட அமைப்பு:

1. திண்ணை – உயர்த்தப்பட்ட வராண்டா:
• தெரு மட்டத்திற்கு மேல் உயர்த்தப்பட்ட திறந்த முன் மேடை
• பார்வையாளர்களை வரவேற்க, அன்றாட கூட்டங்களுக்கு

2. நட்டுக்கோட்டை – வெளிப்புற முற்றம்:
• முக்கிய நுழைவாயிலுக்கு உள்ளே முதல் திறந்த முற்றம்
• விருந்தினர் வரவேற்பு மற்றும் சடங்குகளுக்கு

3. வளவு – உள் முற்றம்:
• மையத்தில் உள்ள திறந்த முற்றம்; வீட்டின் இதயம்
• திருமணம், இறுதி ஊர்வலம், திருவிழாக்கள்
• நான்கு புறங்களிலும் அறைகள்

கட்டுமான பொருட்கள்:
• பர்மா தேக்கு – கதவுகள், சட்டங்கள், தூண்கள், மேற்கூரை உத்திரங்களுக்கு
• இத்தாலிய பளிங்கு – முக்கிய மண்டபங்களுக்கும் முற்றங்களுக்கும்
• பெல்ஜிய கண்ணாடி கண்ணாடிகள் – சுவர்களில் பதிக்கப்பட்டது
• அத்தாங்குடி ஓடுகள் – செட்டிநாட்டிற்கு தனித்துவமான கைத்தின நிறமுள்ள சிமெண்ட் ஓடுகள்
• சுண்ணாம்பு சாந்து (முட்டை வெள்ளை, வெல்லம், சிப்பி சுண்ணாம்பு) – மேற்பரப்புகளுக்கு

அலங்கார அம்சங்கள்:

1. சுண்ணாம்பு கலை வேலைப்பாடு:
• வெளிப்புற மற்றும் உட்புற சுவர்களில் சிக்கலான பூ, பறவை, புராண வடிவங்கள்

2. அத்தாங்குடி ஓடுகள்:
• கரைக்குடி அருகே அத்தாங்குடி கிராமத்தில் கையால் தயாரிக்கப்படுகின்றன
• நிறமிகளுடன் நிறமுள்ள சிமெண்ட்டால் செய்யப்பட்டவை
• இயற்கை குளிர்ச்சி தன்மை

3. தூண்கள் மற்றும் அடைப்புகள்:
• சிங்கம், யானை, பூ வடிவங்களுடன் கல் அல்லது மரத்தூண்கள்

4. வெளிநாட்டு பொருட்களுடன் அலங்காரம்:
• பெல்ஜிய கண்ணாடி குத்துவிளக்குகள்
• ஐரோப்பிய செராமிக் ஓடுகள்
• வெள்ளி மற்றும் பித்தளை சடங்கு பொருட்கள்

காலநிலை பதிலளிப்பு:
• உயர் கூரைகள் இயற்கை குளிர்ச்சியை உருவாக்கும்
• மைய முற்றங்கள் இயற்கை வெளிச்சம் மற்றும் காற்றோட்டத்தை அனுமதிக்கும்
• கனமான சுவர்கள் வெப்பத்தை நிர்வகிக்கும்

முடிவுரை:
செட்டிநாடு மாளிகைகள் தென்னிந்திய பாரம்பரியம், தென்கிழக்கு ஆசிய ஆடம்பர பொருட்கள் மற்றும் ஐரோப்பிய அலங்கார கூறுகளின் தனித்துவமான கலவையை பிரதிநிதித்துவப்படுத்துகின்றன.

முக்கிய சொற்கள்: செட்டிநாடு, நாட்டுக்கோட்டை செட்டியார், அத்தாங்குடி ஓடுகள், பர்மா தேக்கு, திண்ணை, வளவு, சுண்ணாம்பு கலை, பாரம்பரிய கட்டடக்கலை`,
    keywordsEnglish: ["Chettinad", "Nattukotai Chettiar", "Athangudi tiles", "Burmese teak", "thinnai", "valavu", "stucco", "Italian marble"],
    keywordsTamil: ["செட்டிநாடு", "நாட்டுக்கோட்டை செட்டியார்", "அத்தாங்குடி ஓடுகள்", "பர்மா தேக்கு", "திண்ணை", "வளவு", "சுண்ணாம்பு கலை"],
  },

  {
    unit: "Unit II", qNo: 21, marks: 16,
    questionEnglish: "Explain the key features of Indo-Saracenic architecture during the British colonial period.",
    questionTamil: "பிரிட்டிஷ் காலத்தில் இந்தோ-சாரசனிக் கட்டடக்கலையின் முக்கிய அம்சங்களைக்கூறுக.",
    answerEnglish: `Introduction:
Indo-Saracenic architecture (also known as Indo-Gothic or Mughal-Gothic) is a hybrid architectural style developed primarily during British colonial rule in India (c. 1858–1947). British architects sought to create a distinctive "Imperial Indian" style by combining European Gothic and Renaissance elements with Indian (Mughal, Rajput, Hindu, and Dravidian) and Islamic (Saracenic) architectural traditions.

Historical Context:
• After the 1857 Mutiny and the formal establishment of the British Raj (1858), the colonial government sought to build public buildings that symbolized British authority while acknowledging Indian cultural heritage
• The style emerged partly as a political strategy: creating buildings that looked "Indian" to demonstrate sensitivity to local culture while asserting colonial power
• Leading architects: Robert Fellowes Chisholm, William Emerson, Frederick Stevens, Henry Irwin
• Period: 1860s–1940s; peak in late 19th century

Key Architectural Features:

1. Domes (குவிமாடங்கள்):
• Prominent feature borrowed from Mughal and Islamic architecture
• Onion-shaped domes (Mughal style) or hemispherical domes
• Often combined with European Renaissance dome traditions
• Examples: Madras High Court, Victoria Memorial (Kolkata)

2. Pointed Arches (கூர்முனை வளைவுகள்):
• Gothic pointed arches combined with Islamic arch forms
• Horseshoe arches (borrowed from Moorish/Islamic tradition)
• Used in windows, doorways, verandahs, and arcades

3. Minarets (மினாரெட்கள்):
• Slender towers borrowed from Islamic mosque architecture
• Placed at corners and sides of buildings
• Decorative rather than functional (no call to prayer)
• Examples: Madras High Court towers, Chennai Central Station

4. Chhatris (சத்ரிகள்):
• Small kiosk-like pavilions with domed roofs
• Borrowed from Rajput palace architecture
• Placed on rooftops and corner turrets

5. Jaalis (ஜாலிகள்) – Perforated Screens:
• Intricate lattice screens borrowed from Mughal and Rajput traditions
• Allow light and air circulation while providing privacy
• Used in windows, balconies, and balustrades

6. Verandahs (வராண்டா):
• Wide, shaded colonnaded verandahs adapted from both Indian domestic architecture and tropical climate needs
• Often triple or quadruple arched bays

7. Gothic Elements:
• Buttresses – external supports borrowed from European Gothic cathedrals
• Ribbed vaults – ceiling structure inside halls
• Tracery windows – decorative stone window frames
• Towers with crenellations – medieval castle-like battlements

8. Indo-Saracenic Surface Decoration:
• Combination of Islamic geometric patterns (arabesque)
• Hindu floral and mythological motifs
• European acanthus leaf patterns and Renaissance cartouches

Major Indo-Saracenic Buildings in Tamil Nadu:

1. Madras High Court (1892):
• Architect: J.W. Brassington (Public Works Department)
• Features: Red brick exterior, multiple domes, Islamic arches, Gothic towers, minarets
• Largest court complex in Asia at time of construction
• Lighthouse integrated into the building

2. Chennai Central Railway Station (Madras Central, 1873):
• Architect: George Harding
• Features: Central clock tower, arched windows, Gothic-Mughal fusion
• Red brick with terracotta ornamentation

3. Senate House, University of Madras (1879):
• Architect: Robert Fellowes Chisholm
• Features: Central octagonal domed tower, Gothic arches, Venetian Gothic influence
• Considered one of finest examples of Indo-Saracenic in India

4. Egmore Museum (Government Museum, Chennai, 1896):
• Features: Saracenic arches, colonnaded verandahs, red brick

5. Madras High Court Lighthouse:
• Integrated into the courthouse complex

Beyond Tamil Nadu:
• Victoria Memorial, Kolkata – William Emerson (1921); white marble, Mughal + Renaissance dome
• Gateway of India, Mumbai – George Wittet (1924); Indo-Saracenic + Gujarat architectural elements
• Chhatrapati Shivaji Terminus, Mumbai – Frederick Stevens (1887); Gothic + Indian elements

Legacy and Criticism:
1. Indo-Saracenic buildings created a distinctive "colonial Indian" architectural vocabulary
2. These buildings now serve as important government and civic institutions
3. Critics argue the style was superficial — "applying Indian dress to European bodies" without genuine understanding of Indian architectural principles
4. However, the buildings are now celebrated as heritage structures and tourist attractions
5. Conservation efforts protect many of these as listed heritage buildings

Conclusion:
Indo-Saracenic architecture remains a fascinating legacy of the British colonial period — a product of cultural encounter, political calculation, and genuine architectural creativity. In Tamil Nadu, these buildings define the character of Chennai's historic city center and continue to serve as vital public institutions.

Keywords: Indo-Saracenic, British colonial, Madras High Court, domes, minarets, Senate House, Robert Fellowes Chisholm, hybrid style, Gothic, Mughal`,
    answerTamil: `அறிமுகம்:
இந்தோ-சாரசனிக் கட்டடக்கலை (இந்தோ-கோதிக் அல்லது முகலாய-கோதிக் என்றும் அழைக்கப்படும்) முக்கியமாக பிரிட்டிஷ் காலனிய ஆட்சியின் போது (கி.பி. 1858–1947) இந்தியாவில் உருவான கலப்பு கட்டடக்கலை பாணி ஆகும். பிரிட்டிஷ் கட்டடக்கலைஞர்கள் ஐரோப்பிய கோதிக் மற்றும் மறுமலர்ச்சி கூறுகளை இந்திய (முகலாய, ராஜபுத்திர, திராவிட) மற்றும் இஸ்லாமிய (சாரசனிக்) கட்டடக்கலை பாரம்பரியங்களுடன் இணைத்தனர்.

வரலாற்றுப் பின்னணி:
• 1857 கலகத்திற்கும் பிரிட்டிஷ் ராஜ் நிறுவப்பட்டதற்கும் பிறகு (1858), காலனிய அரசு பிரிட்டிஷ் அதிகாரத்தை சங்கேதிக்கும் அதே நேரத்தில் இந்திய கலாச்சார பாரம்பரியத்தை ஒப்புக்கொள்ளும் பொது கட்டடங்களை கட்ட முயன்றனர்
• முக்கிய கட்டடக்கலைஞர்கள்: ராபர்ட் பெலோஸ் சிஷோம், வில்லியம் எமர்சன், ஜார்ஜ் ஹார்டிங்

முக்கிய கட்டடக்கலை அம்சங்கள்:

1. குவிமாடங்கள்:
• முகலாய மற்றும் இஸ்லாமிய கட்டடக்கலையிலிருந்து கடன் வாங்கப்பட்ட முக்கிய அம்சம்
• வெங்காய வடிவ குவிமாடங்கள் (முகலாய பாணி) அல்லது அரைகோள குவிமாடங்கள்

2. கூர்முனை வளைவுகள்:
• கோதிக் கூர்முனை வளைவுகள் இஸ்லாமிய வளைவு வடிவங்களுடன் இணைந்தவை
• குதிரை நாடா வளைவுகள் (மூரிஷ்/இஸ்லாமிய பாரம்பரியத்திலிருந்து)

3. மினாரெட்கள்:
• இஸ்லாமிய மசூதி கட்டடக்கலையிலிருந்து கடன் வாங்கப்பட்ட மெல்லிய கோபுரங்கள்
• மூலைகளில் மற்றும் கட்டடங்களின் பக்கங்களில் வைக்கப்பட்டவை

4. சத்ரிகள்:
• ராஜபுத்திர அரண்மனை கட்டடக்கலையிலிருந்து கடன் வாங்கப்பட்ட சிறிய மண்டப கியோஸ்க்கள்

5. ஜாலிகள் – துளையிட்ட திரைகள்:
• சிக்கலான கிரிட் திரைகள் ஒளி மற்றும் காற்றோட்டத்தை அனுமதிக்கின்றன

6. கோதிக் கூறுகள்:
• ஆதாரங்கள் – வெளிப்புற தூண்கள்
• கோதிக் ரிப்டு கூரை
• ஐரோப்பிய கோட்டை போன்ற யுத்தவீர மதில்கள்

தமிழ்நாட்டில் முக்கிய இந்தோ-சாரசனிக் கட்டடங்கள்:

1. சென்னை உயர் நீதிமன்றம் (1892):
• சிவப்பு செங்கல் வெளிப்புறம், பல குவிமாடங்கள், இஸ்லாமிய வளைவுகள், கோதிக் கோபுரங்கள், மினாரெட்கள்
• கட்டப்பட்ட காலத்தில் ஆசியாவின் மிகப்பெரிய நீதிமன்ற வளாகம்

2. சென்னை மத்திய இரயில் நிலையம் (1873):
• கோதிக்-முகலாய கலவை
• சிவப்பு செங்கல்

3. சென்னை பல்கலைக்கழக அனுமதி அரங்கம் (1879):
• கட்டடக்கலைஞர்: ராபர்ட் பெலோஸ் சிஷோம்
• மத்திய எட்டு கோண குவிமாட கோபுரம்

4. எக்மோர் அருங்காட்சியகம் (1896):
• சாரசனிக் வளைவுகள், தூண் வராண்டாக்கள்

பாரம்பரியம் மற்றும் விமர்சனம்:
1. இந்தோ-சாரசனிக் கட்டடங்கள் தனித்துவமான "காலனிய இந்திய" கட்டடக்கலை அகராதியை உருவாக்கின
2. இந்த கட்டடங்கள் இப்போது முக்கிய அரசு மற்றும் குடியுரிமை நிறுவனங்களாக செயல்படுகின்றன
3. சென்னையின் வரலாற்று மையத்தின் தன்மையை வரையறுக்கும் பாரம்பரிய கட்டடங்களாக கொண்டாடப்படுகின்றன

முடிவுரை:
இந்தோ-சாரசனிக் கட்டடக்கலை பிரிட்டிஷ் காலனிய காலத்தின் கண்கவர் பாரம்பரியமாக உள்ளது.

முக்கிய சொற்கள்: இந்தோ-சாரசனிக்,பிரிட்டிஷ் காலனியம், சென்னை உயர் நீதிமன்றம், குவிமாடங்கள், மினாரெட்கள், கோதிக், முகலாய`,
    keywordsEnglish: ["Indo-Saracenic", "British colonial", "Madras High Court", "domes", "minarets", "Senate House", "hybrid style", "Gothic", "Mughal"],
    keywordsTamil: ["இந்தோ-சாரசனிக்", "பிரிட்டிஷ் காலனியம்", "சென்னை உயர் நீதிமன்றம்", "குவிமாடங்கள்", "மினாரெட்கள்", "கோதிக்"],
  },

  {
    unit: "Unit II", qNo: 22, marks: 16,
    questionEnglish: "Describe in detail the Shore Temple and Cave Temples of Mahabalipuram.",
    questionTamil: "மாமல்லபுரத்தில் உள்ள கடற்கரைக் கோவில்கள் மற்றும் குகைக் கோவில்களை விரிவாக விரிவாக விளக்கவும்.",
    answerEnglish: `Introduction:
Mahabalipuram (Mamallapuram), situated on the Coromandel Coast of Tamil Nadu about 60 km south of Chennai, is one of India's greatest architectural treasure troves. Built primarily during the reign of the Pallava dynasty in the 7th–8th centuries CE, the monuments here include the famous Shore Temple, magnificent cave temples, monolithic rathas, and large bas-relief carvings. The entire site is a UNESCO World Heritage Site (designated 1984).

I. Shore Temple:

Historical Background:
• Built by Pallava king Narasimhavarman II (Rajasimha) around 700–728 CE
• One of the oldest structural stone temples in South India
• Dedicated to Lord Shiva (Shores Temple) with a shrine to Vishnu (Anantashayana) integrated
• Named "Seven Pagodas" by early European sailors who could see its towers from the sea

Architecture:
The Shore Temple is a remarkable structural temple built with cut granite blocks without mortar, showcasing early Rajasimha-style Dravidian architecture.

Structure:
• Three shrines arranged on an east-west axis
• Two Shiva shrines (the main eastern one and a smaller western one) flank a central Vishnu shrine
• Eastern Shiva vimana (main): five-tiered pyramidal tower (approximately 18 metres high)
• Western Shiva vimana: three-tiered, smaller in scale
• Central shrine: Vishnu in Anantashayana (reclining on the serpent Ananta) posture

Key Architectural Features:
• Lion pillars (vyala/simha pilasters) at corners and walls
• Wall sculptures depicting Shiva, Uma, Subrahmanya, and other deities
• A long narrow circumambulatory passage (pradakshina path) around the sanctum
• The outer enclosure wall lined with seated Nandis (sacred bulls) — a distinctive feature
• Faces east toward the rising sun and the Bay of Bengal
• Highly salt-eroded due to centuries of sea spray and storms; conservation work undertaken by ASI

Sculptural Program:
• Somaskanda (Shiva with Uma and Skanda) panels inside sanctum
• Durga, Vishnu, and other deities on outer walls
• Decorative pilasters with lion and kirtimukha (glory face) motifs

UNESCO Heritage Status:
The Shore Temple's rare coastal setting, antiquity, and architectural refinement make it a landmark of world heritage significance.

II. Cave Temples (Mandapa Temples):
Mahabalipuram has numerous cave temples (குடைவரைக் கோவில்கள்) cut into the rocky outcrops, commissioned primarily by Mahendravarman I and Narasimhavarman I (Mamalla).

Major Cave Temples:

1. Mahishasuramardini Cave Temple:
• Three-celled mandapa with exquisite bas-relief panels
• Left panel: Vishnu in Anantashayana – vast, serene composition
• Right panel: Durga (Mahishasuramardini) slaying the buffalo demon Mahisha – dynamic, powerful composition with 18 arms
• Central cell: Shiva with Uma and Skanda (Somaskanda)
• Considered one of the finest sculptural achievements in Indian art

2. Varaha Cave Temple (Adivaraha):
• Four pillars with lion bases; two dvarapalas (guardians)
• Large sculptural panels: Varaha (Boar incarnation of Vishnu) lifting Bhudevi from the cosmic ocean
• Trivikrama (Vishnu as dwarf taking three strides) panel
• Gajalakshmi panel showing Lakshmi being bathed by elephants
• Kings and queens (possibly Pallava royalty) depicted in worship pose

3. Krishna Mandapa:
• Large cave with a pastoral scene: Krishna lifting Govardhan hill to protect Gokula villagers from Indra's rain
• Cattle, cowherd women, and villagers depicted with naturalistic detail
• Demonstrates Pallava interest in narrative Vaishnava themes

4. Pancha Pandava Mandapa (Dharmaraja Mandapa):
• Largest of the cave temples; four columns and two pilasters
• Unfinished; reveals the process of rock excavation
• Inner walls bear incomplete figural sculptures

5. Trimurthi Cave Temple:
• Three cells dedicated to Brahma (left), Vishnu (center), and Shiva (right)
• Each cell has a window allowing light onto the main deity image

6. Ramanuja Mandapa (Tiger Cave):
• Located slightly north of the main site
• Features a circular mandapa with ornate yali (mythical lion) heads around the perimeter
• Used for outdoor performances and rituals

Common Features of Cave Temples:
• Cut into natural granite boulders or rocky outcrops
• Facades with lion-based pillars
• Interior sculptural panels
• Mukhamandapa (front porch) with pillars
• No freestanding superstructure; the rock itself is the vimana

Large Bas-Relief: Arjuna's Penance (Descent of the Ganges):
• World's largest open-air bas-relief (27 m × 9 m)
• Carved on a natural granite face
• Depicts the descent of the Ganga: celestial beings, elephants, deer, nagas (serpents) moving toward the central cleft
• The central cleft represents the sacred river Ganga
• Nandi bull, emaciated figure performing penance (possibly Arjuna or Bhagiratha)

Conclusion:
The Shore Temple and cave temples of Mahabalipuram collectively form one of the world's most extraordinary outdoor art galleries. They document the full range of Pallava artistic achievement — from the earliest cave mandapas to the mature structural Shore Temple — and profoundly influenced all subsequent South Indian temple architecture.

Keywords: Mahabalipuram, Shore Temple, Mahishasuramardini, Varaha Cave, Pallava, Narasimhavarman, UNESCO, bas-relief, Arjuna's Penance, Rajasimha`,
    answerTamil: `அறிமுகம்:
மாமல்லபுரம் (மாமல்லபுரம்) தமிழ்நாட்டின் கோரமாண்டல் கரையில் சென்னையிலிருந்து சுமார் 60 கிமீ தெற்கே அமைந்துள்ளது. முக்கியமாக கி.பி. 7–8ஆம் நூற்றாண்டில் பல்லவ வம்சத்தின் ஆட்சியில் கட்டப்பட்டன. இந்த நினைவுச்சின்னங்கள் முழு தளமும் 1984ல் யுனெஸ்கோ உலக பாரம்பரிய தளமாக அறிவிக்கப்பட்டது.

I. கடற்கரைக் கோயில்:

வரலாற்று பின்னணி:
• கி.பி. 700–728 ஆம் ஆண்டு பல்லவ அரசன் நரசிம்மவர்மன் II (ராஜசிம்மன்) கட்டினார்
• தென்னிந்தியாவின் மிகவும் பழமையான கட்டுமான கல் கோவில்களில் ஒன்று
• சிவன் (முக்கிய ஆலயம்) மற்றும் விஷ்ணு (சயனகோலம்) ஆலயங்கள் உள்ளன
• ஆரம்பகால ஐரோப்பிய மாலுமிகளால் "ஏழு கோபுரங்கள்" என்று அழைக்கப்பட்டது

கட்டடக்கலை அமைப்பு:
• கிழக்கு-மேற்கு அச்சில் மூன்று ஆலயங்கள்
• இரண்டு சிவன் ஆலயங்கள் (கிழக்கில் முக்கியது, சிறிய மேற்கு ஒன்று) மத்திய விஷ்ணு ஆலயத்தை ஆக்கிரமிக்கின்றன
• கிழக்கு சிவன் விமானம் (முக்கியம்): 18 மீட்டர் உயர ஐந்து அடுக்கு கோபுரம்
• நந்திகளால் (புனித காளைகள்) வரிசையிடப்பட்ட வெளிப்புற மதில்

சிற்பங்கள்:
• சோமஸ்கந்த பலகைகள் கருவறையில்
• சுவர்களில் துர்கா, விஷ்ணு, பிற தெய்வங்கள்
• சிங்க மற்றும் கீர்த்திமுக அலங்கார தூண்கள்

II. குகைக் கோவில்கள்:

1. மகிஷாசுரமர்த்தினி குகைக் கோவில்:
• மூன்று அறை மண்டபம்
• இடது பலகை: விஷ்ணு ஆனந்தசயன நிலையில் – அமைதியான, பிரமாண்டமான காட்சி
• வலது பலகை: துர்கா (மகிஷாசுரமர்த்தினி) மகிஷாசுரனை கொல்லுதல் – 18 கைகளுடன் இயக்க பரிபூரண காட்சி
• இந்திய கலையில் மிகவும் சிறந்த சிற்பங்களில் ஒன்று

2. வராக குகைக் கோவில் (ஆதிவராக):
• நான்கு தூண்கள்; இரு வாயிற்காவலர்கள்
• வராக (வராக அவதாரம்) பூதேவியை பிரபஞ்ச கடலிலிருந்து தூக்கும் பிரமாண்ட சிற்ப பலகை
• கஜலக்ஷ்மி பலகை – யானைகளால் குளிப்பாட்டப்படும் லட்சுமி

3. கிருஷ்ண மண்டபம்:
• கிருஷ்ணன் கோவர்த்தன மலையை தூக்கும் மேய்ச்சல் காட்சி
• மாடுகள், இடையர் பெண்கள், கிராமத்தினர் இயற்கையோடு சித்தரிக்கப்பட்டுள்ளனர்

4. திரிமூர்த்தி குகைக் கோவில்:
• பிரம்மா (இடது), விஷ்ணு (மையம்), சிவன் (வலது) – மூன்று அறைகள்

பெரிய பாறை நிவர்ண சிற்பம் – அர்ஜுனன் தவம் (கங்கை அவதரணம்):
• உலகின் மிகப்பெரிய திறந்தவெளி பாறை நிவர்ண சிற்பம் (27 மீ × 9 மீ)
• இயற்கையான கரடிட்ட பாறை முகத்தில் செதுக்கப்பட்டது
• கங்கை அவதரணத்தை சித்தரிக்கிறது: தேவர்கள், யானைகள், மான்கள், நாகங்கள் மத்திய பிளவை நோக்கி நகர்கின்றன

முடிவுரை:
மாமல்லபுரத்தின் கடற்கரைக் கோவிலும் குகைக் கோவில்களும் சேர்ந்து உலகின் மிகத் தனித்துவமான திறந்தவெளி கலை அரங்குகளில் ஒன்றை உருவாக்குகின்றன.

முக்கிய சொற்கள்: மாமல்லபுரம், கடற்கரைக் கோவில், மகிஷாசுரமர்த்தினி, வராக குகை, பல்லவர், நரசிம்மவர்மன், யுனெஸ்கோ, அர்ஜுன தவம்`,
    keywordsEnglish: ["Mahabalipuram", "Shore Temple", "Mahishasuramardini", "Varaha Cave", "Pallava", "Narasimhavarman", "UNESCO", "Arjuna's Penance"],
    keywordsTamil: ["மாமல்லபுரம்", "கடற்கரைக் கோவில்", "மகிஷாசுரமர்த்தினி", "வராக குகை", "பல்லவர்", "நரசிம்மவர்மன்", "யுனெஸ்கோ"],
  },

  // ─── UNIT III ───
  {
    unit: "Unit III", qNo: 1, marks: 2,
    questionEnglish: "What are the other names for rafters (construction beams)?",
    questionTamil: "கட்டு மரங்களின் வேறு பெயர்கள் யாவை?",
    answerEnglish: "Rafters (beams used in shipbuilding) are called: Kattumaram (கட்டுமரம்), Thoni maram (தோணி மரம்), Kappal maram (கப்பல் மரம்). The English word 'catamaran' derives from Tamil 'kattumaram' (tied logs). Teak, rosewood, and palmyra were commonly used.",
    answerTamil: "கட்டுமரங்கள் பல பெயர்களில் அழைக்கப்படுகின்றன: கட்டுமரம், தோணி மரம், கப்பல் மரம். ஆங்கில 'catamaran' என்ற சொல் தமிழ் 'கட்டுமரம்' இலிருந்து வந்தது. தேக்கு, வேங்கை, பனை மரங்கள் பொதுவாக பயன்பட்டன.",
    keywordsEnglish: ["kattumaram", "catamaran", "teak", "rafters"],
    keywordsTamil: ["கட்டுமரம்", "தோணி மரம்", "கப்பல் மரம்", "தேக்கு"],
  },
  {
    unit: "Unit III", qNo: 2, marks: 2,
    questionEnglish: "How many types of boats are mentioned in Sangam literature?",
    questionTamil: "சங்க இலக்கியத்தில் கூறப்பட்டுள்ள கலங்கள் எத்தனை?",
    answerEnglish: "Sangam literature mentions approximately six to seven types of watercraft: (1) Kattumaram – fishing raft; (2) Thoni – small river boat; (3) Padagu – medium coastal vessel; (4) Kappal – large ocean-going ship; (5) Oodam – war vessel, and others.",
    answerTamil: "சங்க இலக்கியங்கள் சுமார் ஆறு முதல் ஏழு வகை கலங்களை குறிப்பிடுகின்றன: (1) கட்டுமரம் – மீன்பிடி மிதவை; (2) தோணி – சிறிய படகு; (3) படகு – நடுத்தர கப்பல்; (4) கப்பல் – பெரிய கடல்சாரி கப்பல்; (5) ஊடம் – போர்க் கப்பல் மற்றும் பிறவை.",
    keywordsEnglish: ["kattumaram", "thoni", "padagu", "kappal", "Sangam"],
    keywordsTamil: ["கட்டுமரம்", "தோணி", "படகு", "கப்பல்", "சங்க காலம்"],
  },
  {
    unit: "Unit III", qNo: 3, marks: 2,
    questionEnglish: "Write a brief note about the Parathavar.",
    questionTamil: "பரதர் பற்றி குறிப்பு எழுக.",
    answerEnglish: "Parathavar (பரதர்) were ancient Tamil coastal people of the Neythal (நெய்தல்) landscape. They were skilled fishermen, sailors, and pearl divers who played a crucial role in Tamil maritime trade, operating fishing boats and trade vessels. They are still found in coastal Tamil Nadu and Sri Lanka.",
    answerTamil: "பரதர் என்பவர் நெய்தல் திணையில் வாழ்ந்த பண்டைய தமிழ் கடல்சார் சமூகத்தினர். திறன்வாய்ந்த மீனவர்கள், மாலுமிகள், முத்து குளிப்பவர்கள். பண்டைய கடல்வாணிகத்தில் முக்கிய பங்கு வகித்தனர். இன்றும் கடலோர தமிழகம் மற்றும் இலங்கையில் காணப்படுகிறார்கள்.",
    keywordsEnglish: ["Parathavar", "fishermen", "maritime", "pearl diving", "Neythal"],
    keywordsTamil: ["பரதர்", "மீனவர்", "கடல்சார்", "முத்து குளிப்பு", "நெய்தல்"],
  },
  {
    unit: "Unit III", qNo: 4, marks: 2,
    questionEnglish: "What is bipolar electric discharge?",
    questionTamil: "இருமுனை மின் இறக்கம் என்றால் என்ன?",
    answerEnglish: "Bipolar electric discharge is an ancient stone-splitting technique used in bead making. A stone is placed between two metal points and struck, causing it to fracture along natural planes. Ancient artisans at Kodumanal used this to split carnelian and quartz for bead manufacturing.",
    answerTamil: "இருமுனை மின் இறக்கம் என்பது மணி தயாரிப்பில் பயன்படுத்திய பண்டைய கல் பிளக்கும் நுட்பம். ஒரு கல்லை இரண்டு உலோக முனைகளுக்கு இடையே வைத்து தாக்குவதால் இயற்கை தளங்களில் பிளக்கும். கோடுமணலில் கோமேதகம், குவார்ட்ஸ் பிளக்க பயன்பட்டது.",
    keywordsEnglish: ["bipolar", "bead making", "Kodumanal", "carnelian", "stone splitting"],
    keywordsTamil: ["இருமுனை", "மணி செய்தல்", "கோடுமணல்", "கோமேதகம்"],
  },
  {
    unit: "Unit III", qNo: 5, marks: 2,
    questionEnglish: "Write about ancient smelting furnaces.",
    questionTamil: "உலைக்களம் பற்றி எழுதுக.",
    answerEnglish: "Ancient smelting furnaces (உலைக்களம்) extracted metals from ores using high heat. In Tamil Nadu, iron smelting furnaces were found at Kodumanal, Adichanallur, and hill regions. Clay furnaces with bellows (துருத்தி) raised temperatures; charcoal was used as fuel to produce iron, copper, and bronze implements.",
    answerTamil: "உலைக்களம் என்பது உயர் வெப்பத்தால் தாதுக்களிலிருந்து உலோகம் பிரிக்கும் கட்டமைப்பு. தமிழகத்தில் கோடுமணல், ஆதிச்சநல்லூர், மலைப்பகுதிகளில் இரும்பு சூளைகள் கண்டெடுக்கப்பட்டன. துருத்தி மூலம் வெப்பம் உயர்த்தப்பட்டது; கரிக்கட்டை எரிபொருளாக பயன்பட்டது.",
    keywordsEnglish: ["smelting furnace", "iron", "Kodumanal", "bellows", "charcoal"],
    keywordsTamil: ["உலைக்களம்", "இரும்பு", "கோடுமணல்", "துருத்தி", "கரிக்கட்டை"],
  },
  {
    unit: "Unit III", qNo: 6, marks: 2,
    questionEnglish: "How are iron-related crops mentioned in Sangam literature?",
    questionTamil: "சங்க இலக்கியத்தில் இரும்பு பற்றிய பயிர்கள் எவ்வாறு குறிப்பிடப்படுகிறது?",
    answerEnglish: "Sangam literature uses iron metaphorically: iron ore-bearing hills are described as producing iron 'crops'. Akananuru and Purananuru describe blacksmiths forging weapons at night. Patinappalai mentions iron merchants at Puhar's market. The word 'Irumbu' (iron) appears frequently throughout Sangam texts.",
    answerTamil: "சங்க இலக்கியங்கள் இரும்பை உருவகமாக விவரிக்கின்றன: இரும்பு தாது கொண்ட மலைகள் இரும்பு 'பயிர்' விளைவிப்பதாக விவரிக்கப்படுகின்றன. அகநானூறு, புறநானூறு இரும்பு கொல்லர்களை விவரிக்கின்றன. 'இரும்பு' என்ற சொல் அடிக்கடி தோன்றுகிறது.",
    keywordsEnglish: ["iron", "Sangam", "blacksmith", "Irumbu", "metaphor"],
    keywordsTamil: ["இரும்பு", "சங்க காலம்", "கொல்லர்", "இரும்பு பயிர்"],
  },
  {
    unit: "Unit III", qNo: 7, marks: 2,
    questionEnglish: "Write a brief note about ancient coins.",
    questionTamil: "நாணயங்கள் குறிப்பு எழுக.",
    answerEnglish: "Ancient Tamil coins were made of copper, silver, and gold, bearing dynastic emblems: fish (Pandya), tiger (Chola), bow (Chera). Punch-marked coins were found at Uraiyur and Karur. Roman coins found in Tamil Nadu confirm international trade. Coins helped transition from barter to a monetary economy.",
    answerTamil: "பண்டைய தமிழ் நாணயங்கள் செம்பு, வெள்ளி, தங்கத்தால் ஆனவை; மீன் (பாண்டியர்), புலி (சோழர்), வில் (சேரர்) சின்னங்கள் கொண்டவை. உறையூர், கரூரில் குத்துமுத்திரை நாணயங்கள் கண்டெடுக்கப்பட்டன. ரோமன் நாணயங்கள் சர்வதேச வணிகத்தை உறுதிப்படுத்துகின்றன.",
    keywordsEnglish: ["coins", "fish symbol", "Pandya", "Chola", "Roman coins"],
    keywordsTamil: ["நாணயங்கள்", "மீன் சின்னம்", "பாண்டியர்", "சோழர்", "ரோமன் நாணயம்"],
  },
  {
    unit: "Unit III", qNo: 8, marks: 2,
    questionEnglish: "List the names of the nine gemstones (Navaratnas).",
    questionTamil: "நவரத்தினக்கற்களின் பெயர்களை எழுதுக.",
    answerEnglish: "The nine Navaratnas: (1) Diamond (வைரம்), (2) Ruby (மாணிக்கம்), (3) Emerald (மரகதம்), (4) Pearl (முத்து), (5) Coral (பவளம்), (6) Sapphire (நீலம்), (7) Cat's Eye (வைடூரியம்), (8) Hessonite Garnet (கோமேதகம்), (9) Yellow Sapphire (புஷ்பராகம்).",
    answerTamil: "நவரத்தினங்கள்: (1) வைரம், (2) மாணிக்கம், (3) மரகதம், (4) முத்து, (5) பவளம், (6) நீலம், (7) வைடூரியம், (8) கோமேதகம், (9) புஷ்பராகம். இந்த ஒன்பது இரத்தினங்கள் ஒன்பது கிரகங்களுடன் தொடர்புடையவை.",
    keywordsEnglish: ["diamond", "ruby", "emerald", "pearl", "coral", "Navaratna"],
    keywordsTamil: ["வைரம்", "மாணிக்கம்", "மரகதம்", "முத்து", "பவளம்", "நவரத்தினம்"],
  },
  {
    unit: "Unit III", qNo: 9, marks: 2,
    questionEnglish: "Who are the Kammiyar?",
    questionTamil: "கம்மியர் என்பவர் யார்?",
    answerEnglish: "Kammiyar (கம்மியர்) are ancient Tamil artisans specializing in metalwork — blacksmithing and gold/silversmithing. They are one of the Panchalas (five artisan castes). They forged tools, weapons, agricultural implements, and ornaments, playing a vital role in the ancient Tamil economy.",
    answerTamil: "கம்மியர் என்பவர் உலோக வேலைகளில் – இரும்பு கொல்லர் மற்றும் தங்க/வெள்ளி நகை வேலையில் – நிபுணத்துவம் கொண்ட பண்டைய தமிழ் கைவினை சமூகம். பஞ்சாலர்களில் ஒருவர். கருவிகள், ஆயுதங்கள், அணிகலன்கள் உருவாக்கினர்.",
    keywordsEnglish: ["Kammiyar", "metalwork", "blacksmith", "Panchalas"],
    keywordsTamil: ["கம்மியர்", "உலோக வேலை", "கொல்லர்", "பஞ்சாலர்"],
  },
  {
    unit: "Unit III", qNo: 10, marks: 2,
    questionEnglish: "Who are the Kuyinar?",
    questionTamil: "குயிஞர் என்பவர் யார்?",
    answerEnglish: "Kuyinar (குயிஞர்) are ancient Tamil potters who specialize in making clay vessels. They are one of the Panchalas (five artisan castes). Using the potter's wheel (குயவர் சக்கரம்), they created everyday utensils, storage pots, ritual vessels, and terracotta figurines for daily life and trade.",
    answerTamil: "குயிஞர் என்பவர் களிமண் பாத்திரங்கள் தயாரிப்பில் நிபுணத்துவம் கொண்ட பண்டைய தமிழ் குயவர் சமூகம். பஞ்சாலர்களில் ஒருவர். குயவர் சக்கரம் பயன்படுத்தி அன்றாட பாத்திரங்கள், சேமிப்பு குடங்கள், சடங்கு பாத்திரங்கள், மண் சிலைகள் உருவாக்கினர்.",
    keywordsEnglish: ["Kuyinar", "potters", "Panchalas", "potter's wheel"],
    keywordsTamil: ["குயிஞர்", "குயவர்", "பஞ்சாலர்", "குயவர் சக்கரம்"],
  },
  {
    unit: "Unit III", qNo: 11, marks: 2,
    questionEnglish: "Name the different shapes of beads.",
    questionTamil: "மணிகளின் வடிவங்களைக்கூறுக.",
    answerEnglish: "Ancient Tamil bead shapes: (1) Cylindrical (உருளை), (2) Spherical/Round (உருண்டை), (3) Disc-shaped (தட்டை), (4) Barrel (பீப்பாய்), (5) Bicone/Double-cone (இரட்டை கூம்பு), (6) Faceted (பல முகங்கள்), (7) Long tube (நீண்ட குழாய்). Found at Kodumanal and other sites.",
    answerTamil: "பண்டைய தமிழ் மணி வடிவங்கள்: (1) உருளை, (2) உருண்டை, (3) தட்டை, (4) பீப்பாய் வடிவம், (5) இரட்டை கூம்பு, (6) பல முகங்கள், (7) நீண்ட குழாய். கோடுமணல் போன்ற தொல்லியல் களங்களில் கண்டெடுக்கப்பட்டன.",
    keywordsEnglish: ["cylindrical", "spherical", "disc", "barrel", "bicone", "beads"],
    keywordsTamil: ["உருளை", "உருண்டை", "தட்டை", "பீப்பாய்", "இரட்டை கூம்பு"],
  },
  {
    unit: "Unit III", qNo: 12, marks: 2,
    questionEnglish: "Write a brief note about colored glass beads.",
    questionTamil: "வண்ணக்கண் குறிப்பு எழுக.",
    answerEnglish: "Colored glass beads (வண்ணக்கண்) were prized ornamental items in ancient Tamil Nadu. Found at Arikamedu (Puducherry) and Kodumanal, they were made of silica-based glass colored with metallic oxides in blue, green, amber, and red. Used in necklaces and earrings, they were traded internationally with Rome and Southeast Asia.",
    answerTamil: "வண்ண கண்ணாடி மணிகள் பண்டைய தமிழகத்தில் விலையுயர்ந்த அலங்கார பொருட்கள். அரிக்கமேடு மற்றும் கோடுமணலில் பரவலாக கண்டெடுக்கப்பட்டன. உலோக ஆக்சைடுகளால் வண்ணமிட்ட சிலிக்கா கண்ணாடியால் செய்யப்பட்டவை. ரோம், தென்கிழக்கு ஆசியாவுடன் வணிகம் செய்யப்பட்டன.",
    keywordsEnglish: ["glass beads", "Arikamedu", "Kodumanal", "trade", "ornament"],
    keywordsTamil: ["கண்ணாடி மணிகள்", "அரிக்கமேடு", "கோடுமணல்", "வணிகம்"],
  },
  {
    unit: "Unit III", qNo: 13, marks: 2,
    questionEnglish: "How many shapes of beads are there? What are they?",
    questionTamil: "மணிகளின் வடிவங்கள் எத்தனை? அவை யாவை?",
    answerEnglish: "Ancient Tamil beads are found in seven major shapes: (1) Cylindrical, (2) Spherical, (3) Disc/Flat, (4) Barrel, (5) Bicone/Double cone, (6) Faceted/Multi-faced, and (7) Long tube/Elongated. Identified from excavations at Kodumanal, Arikamedu, and other Tamil Nadu sites.",
    answerTamil: "பண்டைய தமிழ் மணிகள் ஏழு முக்கிய வடிவங்களில்: (1) உருளை, (2) உருண்டை, (3) தட்டை, (4) பீப்பாய், (5) இரட்டை கூம்பு, (6) பல முகங்கள், (7) நீண்ட குழாய். கோடுமணல், அரிக்கமேடு உள்ளிட்ட தமிழகத் தளங்களில் கண்டெடுக்கப்பட்டவை.",
    keywordsEnglish: ["seven shapes", "cylindrical", "spherical", "bicone", "faceted"],
    keywordsTamil: ["ஏழு வடிவங்கள்", "உருளை", "உருண்டை", "இரட்டை கூம்பு"],
  },
  {
    unit: "Unit III", qNo: 14, marks: 2,
    questionEnglish: "Which beads are mentioned in Silappathikaram?",
    questionTamil: "சிலப்பதிகாரத்தில் குறிப்பிடப்படும் மணிகள் யாவை?",
    answerEnglish: "Silappathikaram's Urukan Kadai chapter mentions: (1) Muththu – pearl; (2) Manikam – ruby; (3) Marakadham – emerald; (4) Vairam – diamond; (5) Pavalam – coral; (6) Neelam – sapphire; (7) Gomethagam – hessonite/carnelian. These adorned women of ancient Puhar.",
    answerTamil: "சிலப்பதிகாரம் ஊர்காண் காதையில் குறிப்பிடப்படும் மணிகள்: (1) முத்து, (2) மாணிக்கம் (ரூபி), (3) மரகதம், (4) வைரம், (5) பவளம், (6) நீலம், (7) கோமேதகம். இவை பண்டைய புகார் நகர பெண்களின் அணிகலன்களாக இருந்தன.",
    keywordsEnglish: ["Silappathikaram", "pearl", "ruby", "emerald", "diamond", "coral"],
    keywordsTamil: ["சிலப்பதிகாரம்", "முத்து", "மாணிக்கம்", "மரகதம்", "வைரம்", "பவளம்"],
  },
  {
    unit: "Unit III", qNo: 15, marks: 2,
    questionEnglish: "What kinds of objects were made from beads?",
    questionTamil: "மணிகளால் என்னென்ன பொருட்கள் செய்தனர்?",
    answerEnglish: "Beads were used to make: (1) Necklaces (மாலை/கழுத்தணி); (2) Earrings (காதணி/குண்டலம்); (3) Bracelets and bangles (வளையல்); (4) Anklets (சிலம்பு/கொலுசு); (5) Hair ornaments (சூடகம்); (6) Waist ornaments (மேகலை); (7) Ritual and deity decorations.",
    answerTamil: "மணிகளால் செய்யப்பட்டவை: (1) மாலை/கழுத்தணி; (2) காதணி/குண்டலம்; (3) வளையல்கள்; (4) சிலம்பு/கொலுசு; (5) சூடகம் (தலை அணி); (6) மேகலை (இடை அணி); (7) சடங்கு பொருட்கள் மற்றும் தெய்வ அலங்காரங்கள்.",
    keywordsEnglish: ["necklaces", "earrings", "bracelets", "anklets", "hair ornaments"],
    keywordsTamil: ["மாலை", "காதணி", "வளையல்", "சிலம்பு", "சூடகம்"],
  },
  {
    unit: "Unit III", qNo: 16, marks: 16,
    questionEnglish: "Explain and write about the ancient Tamil shipbuilding technology (Maritime Arts of Ancient Tamils).",
    questionTamil: "பழந்தமிழர் கப்பல் கலை குறித்து விளக்கி எழுதுக.",
    answerEnglish: `Introduction:
Ancient Tamils were master mariners and shipbuilders. Their maritime prowess is documented in Sangam literature, classical epics, and archaeological evidence from coastal sites. The sea (கடல்) was not a barrier but a highway for the ancient Tamils, enabling trade, cultural exchange, and political influence across the Indian Ocean world.

Literary Evidence of Maritime Activity:
• Sangam poetry (Akananuru, Purananuru, Pattinappalai) frequently describes ships, sailors, sea voyages, and ports
• Pattinappalai describes the busy port of Puhar with large ships (கப்பல்கள்) bearing many goods
• Akananuru describes the coastal community (Parathavar), their boats, and fishing activities
• Silappadikaram mentions the merchant Kovalan's sea trade connections

Types of Ancient Tamil Watercraft:

1. Kattumaram (கட்டுமரம்) – Log Raft:
• Simplest form: three to five logs tied together with coir rope
• Used primarily for fishing in near-shore waters
• The word "catamaran" in English is derived from Tamil "kattumaram" (tied logs)
• Extremely stable in waves; still used by Tamil fishermen today

2. Thoni (தோணி) – Small Boat:
• Dugout or planked boat for river and lagoon use
• Carried passengers and small cargo along rivers and backwaters
• Typically poled or paddled

3. Padagu (படகு) – Medium Vessel:
• Larger than thoni; used for coastal trade
• Wooden planks joined with rope lashing (no nails initially; later iron nails)
• Carried moderate cargo between ports

4. Kappal (கப்பல்) – Large Ocean-Going Ship:
• Large merchant vessel capable of ocean crossings
• Used for trade with Rome, Arabia, Southeast Asia, and China
• Had multiple masts with large square sails
• Large cargo capacity for trade goods: textiles, spices, gems, ivory

5. Oodam (ஊடம்) – War Vessel:
• Specifically designed for naval warfare
• Faster and more maneuverable than merchant ships
• Armed with soldiers and weapons; sometimes with fire weapons

Ancient Tamil Shipbuilding Technology:

Wood Selection:
• Teak (தேக்கு மரம்) – Most prized for its resistance to rot and insect damage in tropical waters
• Rosewood (வேங்கை) – Used for frames and structural components
• Palmyra (பனை மரம்) – Used for masts and planking in smaller boats
• Jack wood (பலா) – Used for components requiring hardness

Construction Techniques:

1. Plank-built (Sewn Boat Technique):
• Planks were edge-joined and lashed together with coir rope rather than nails
• The lashed planks allowed some flexibility — important for absorbing wave stress
• Caulking with fish oil, coconut fibre, and tree resin sealed gaps

2. Hull Design:
• Double-ended hull (pointed at both bow and stern) for ease of reversing direction
• Shallow draft design for navigating coastal waters and river mouths
• Later ships had deeper hulls for ocean passages

3. Propulsion:
• Square sails made of woven cotton cloth or matting
• Oars (துடுப்பு) for maneuvering in harbors and against wind
• Seasonal use of monsoon winds for long-distance trade

Navigation Knowledge:
• Stellar navigation – stars like Dhruva (Pole Star) used for north-south orientation
• Seasonal monsoon wind patterns known and exploited for voyages to Arabia (SW monsoon) and return (NE monsoon)
• Coastal landmarks used for coastal navigation
• Bird behavior (especially frigate birds) used to identify land proximity

Key Ports of Ancient Tamil Maritime Trade:

1. Puhar / Kaveripoompattinam (காவேரிப்பூம்பட்டினம்):
• Principal Chola port; trade with Rome and Southeast Asia
• Described extensively in Sangam literature and Silappadikaram
• Archaeological evidence: Roman pottery (amphorae), coins

2. Musiri (முசிறி / Muziris):
• Major Chera port (modern Kodungallur, Kerala)
• Famous for pepper and spice trade with Rome
• The Muziris Papyrus (Roman trade document) records trade at this port

3. Korkai (கொற்கை):
• Pearl fishing center and Pandya port
• Famous for pearls from Gulf of Mannar
• Later superseded by Kayal as port

4. Arikamedu (அரிக்கமேடு):
• Near Puducherry; major Sangam-period port
• Extensive Roman artefacts (Arretine ware, amphorae) found by archaeologists

Trade Goods and Routes:
• Exports from Tamil ports: fine muslin (kūlam), pepper, cinnamon, ivory, pearls, gems, tortoiseshell, indigo, iron
• Imports: Roman gold coins, wine, glassware, coral, copper
• Trade routes: Tamil Nadu → Sri Lanka → Southeast Asia (Malacca Strait) → China
• Tamil Nadu → Arabian Sea → Arabian Peninsula → Roman Empire (via Red Sea)

Archaeological Evidence:
• Roman coins found at Karur, Uraiyur, Madurai, Arikamedu
• Roman pottery at Arikamedu
• Tamil-Brahmi inscriptions in Egypt (Berenice port) showing Tamil trader presence
• Tamil graffiti on pottery in Thailand, Indonesia, Sri Lanka

Naval Power:
• Chola king Rajendra I (11th century CE) led a famous naval expedition to Southeast Asia (Srivijaya) – one of the greatest naval expeditions in Asian history
• The Chola navy controlled the Bay of Bengal trade routes

Legacy:
• Tamil maritime vocabulary: terms like "kappal" (ship), "nakhuda" (ship's captain from Tamil/Arabic), "catamaran" have entered world languages
• Tamil trading communities (Chettiars, Maraikkayars) continued maritime trade traditions into modern times
• Project Mausam (UNESCO) documents ancient Tamil maritime connections

Conclusion:
Ancient Tamil shipbuilding and maritime technology was among the most sophisticated in the ancient world. Combining robust wooden ship construction, deep knowledge of monsoon patterns, and commercial enterprise, ancient Tamils built an oceanic trading network that connected the Mediterranean to East Asia.

Keywords: kattumaram, kappal, thoni, Puhar, Arikamedu, Muziris, monsoon trade, Tamil maritime, Rajendra Chola naval expedition`,
    answerTamil: `அறிமுகம்:
பண்டைய தமிழர்கள் சிறந்த மாலுமிகளும் கப்பல் கட்டுபவர்களும் ஆவர். அவர்களின் கடல் திறன் சங்க இலக்கியத்திலும், கலைஞர் இலக்கியங்களிலும், கடற்கரை தளங்களிலிருந்து தொல்லியல் சான்றுகளிலும் ஆவணப்படுத்தப்பட்டுள்ளது.

இலக்கிய சான்றுகள்:
• சங்க கவிதைகள் (அகநானூறு, புறநானூறு, பட்டினப்பாலை) கப்பல்கள், மாலுமிகள், கடல் பயணங்கள் மற்றும் துறைமுகங்களை விவரிக்கின்றன
• பட்டினப்பாலை பல பொருட்களுடன் பெரிய கப்பல்களைக் கொண்டு பிஸியான புகார் துறைமுகத்தை விவரிக்கிறது
• சிலப்பதிகாரம் வணிகன் கோவலனின் கடல் வணிக தொடர்புகளை குறிப்பிடுகிறது

பண்டைய தமிழ் நீர்ப்போக்குவரத்து வகைகள்:

1. கட்டுமரம்:
• மூன்று முதல் ஐந்து கொட்டை கட்டுடன் கோஃப் தண்ணீரில் பயன்படுத்தப்படும்
• "catamaran" என்ற ஆங்கிலச் சொல் தமிழ் "கட்டுமரம்" என்பதிலிருந்து வந்தது

2. தோணி:
• ஆறு மற்றும் நீர்ப்பகுதிகளுக்கான சிறிய படகு
• பயணிகள் மற்றும் சிறிய சரக்குகளை கொண்டு செல்லும்

3. படகு:
• கடலோர வணிகத்திற்கான நடுத்தர அளவிலான கப்பல்

4. கப்பல்:
• ரோம், அரேபியா, தென்கிழக்கு ஆசியா, சீனாவுடன் வணிகத்திற்கான பெரிய கடல்சாரி கப்பல்
• பல மாஸ்ட்கள் மற்றும் சதுர பாய்மரங்கள்

பண்டைய தமிழ் கப்பல் கட்டுமான தொழில்நுட்பம்:

மரம் தேர்வு:
• தேக்கு – வெப்பமண்டல நீரில் அழுகல் எதிர்ப்புக்கு சிறந்தது
• வேங்கை – சட்டங்கள் மற்றும் கட்டமைப்பு கூறுகளுக்கு

கட்டுமான நுட்பங்கள்:
1. கோஃப் கட்டிடம் (தையல் படகு நுட்பம்):
• பலகைகளை ஆணிகள் இல்லாமல் கோஃப் கயிற்றால் இணைத்தல்
• இணைக்கப்பட்ட பலகைகள் சில நெகிழ்வுத்தன்மையை அனுமதிக்கின்றன

2. படகு வடிவமைப்பு:
• இரட்டை-முனை வடிவம்
• கடற்கரை நீரில் செல்ல ஆழமற்ற வரைபு

திசை அறிவு:
• நட்சத்திர வழிசெலுத்தல் – துருவ நட்சத்திரம் வட-தென் திசைக்கு
• பருவமழை காற்று வடிவங்கள் – அரேபியாவிற்கு SW பருவமழை, திரும்புவதற்கு NE

முக்கிய துறைமுகங்கள்:
• புகார் / காவேரிப்பூம்பட்டினம் – முக்கிய சோழ துறைமுகம்
• முசிறி – பிரபல சேர துறைமுகம்; ரோமன் வணிகம்
• கொற்கை – முத்து மீன்பிடி மையம்
• அரிக்கமேடு – ரோமன் பொருட்கள் கண்டெடுக்கப்பட்ட முக்கிய தளம்

வணிக பொருட்கள்:
• ஏற்றுமதி: கூலம் (நேர்த்தியான பருத்தி), மிளகு, தந்தம், முத்து, இரத்தினங்கள்
• இறக்குமதி: ரோமன் தங்க நாணயங்கள், மது, கண்ணாடிப் பொருட்கள்

தொல்லியல் சான்றுகள்:
• கரூர், உறையூர், மதுரை, அரிக்கமேடில் ரோமன் நாணயங்கள்
• தமிழ்-பிராமி கல்வெட்டுகள் எகிப்தில் (பெரெனிகே துறைமுகம்) தமிழ் வணிகர் இருப்பை காட்டுகின்றன

முடிவுரை:
பண்டைய தமிழ் கப்பல் கட்டுமானம் மற்றும் கடல் தொழில்நுட்பம் பண்டைய உலகில் மிகவும் நுட்பமானவற்றில் ஒன்றாகும். இந்திய மடல்சாரி கப்பல்கள் கட்டுவது, பருவமழை வடிவங்கள் பற்றிய ஆழமான அறிவு மற்றும் வணிக முயற்சி ஆகியவற்றை இணைத்து, பண்டைய தமிழர்கள் மத்தியதரைக்கடலை கிழக்கு ஆசியாவுடன் இணைக்கும் ஒரு கடல் வணிக வலையமைப்பை கட்டினர்.

முக்கிய சொற்கள்: கட்டுமரம், கப்பல், தோணி, புகார், அரிக்கமேடு, முசிறி, பருவமழை வணிகம்`,
    keywordsEnglish: ["kattumaram", "kappal", "thoni", "Puhar", "Arikamedu", "Muziris", "monsoon trade", "Tamil maritime"],
    keywordsTamil: ["கட்டுமரம்", "கப்பல்", "தோணி", "புகார்", "அரிக்கமேடு", "முசிறி", "பருவமழை வணிகம்"],
  },

  {
    unit: "Unit III", qNo: 17, marks: 16,
    questionEnglish: "Describe the metallurgical skills of ancient Tamils with supporting evidence.",
    questionTamil: "பண்டைய தமிழர்களின் உலோகவியல் திறனை ஆதாரங்களுடன் விளக்குங்கள்.",
    answerEnglish: `Introduction:
The metallurgical skills of ancient Tamils rank among the finest in the ancient world. Evidence from archaeological excavations, Sangam literature, and classical texts reveals that ancient Tamils were experts in iron smelting, copper casting, bronze making, gold work, and bead manufacture from precious and semi-precious stones. Their metal technology underpinned agriculture, trade, warfare, and artistic production.

I. Iron Technology:

Evidence from Sangam Literature:
• Akananuru, Purananuru, and Patinappalai frequently describe iron weapons and tools
• Iron ore-bearing hills described as producing iron 'crops' — a metaphor for iron smelting
• References to Kollar (கொல்லர் — blacksmiths) working at night forging weapons
• Patinappalai mentions iron merchants in Puhar's market
• The word 'Irumbu' (இரும்பு) appears frequently throughout Sangam texts

Archaeological Evidence of Iron Smelting:

1. Kodumanal (Erode district):
• Major iron-working site; smelting furnaces (உலைக்களம்) excavated
• Iron slag and bloom discovered in abundance
• Remains of bellows (துருத்தி) tuyères (clay nozzles for air injection)
• Iron artefacts: spearheads, knives, arrowheads, agricultural tools (sickles, axes)
• Evidence of bipolar technique for bead splitting alongside iron smelting

2. Adichanallur (Tirunelveli):
• Iron implements in burial urns: swords, spearheads, arrowheads
• Iron agriculture tools alongside food offerings

3. Porunthal (Palani, Dindigul):
• Iron artefacts with associated paddy grains (earliest iron-paddy connection in TN)
• Dating: c. 490 BCE (radiocarbon dating) — pushing Tamil Iron Age further back

4. Perur (Coimbatore):
• Iron smelting site with slag, tuyères, furnace debris

Smelting Process:
1. Iron ore (magnetite or laterite) collected from ore-bearing hills
2. Ore roasted to remove impurities
3. Clay furnace (சூளை) built; charged with alternating layers of charcoal and ore
4. Bellows (துருத்தி — leather bellows) provided forced air to raise temperature
5. Bloom iron (sponge iron) extracted and hammered into shape while hot
6. Skilled hammering (forging) shaped the metal into tools and weapons

Wootz Steel (Chennai Steel / Ukku):
• Ancient Tamils produced a high-quality steel known as Wootz (from Tamil 'ukku' — steel)
• Wootz steel was crucible steel: iron combined with carbon in sealed clay crucibles
• Known for its exceptional hardness, edge retention, and characteristic watered-pattern surface
• Exported to the ancient world (Roman Empire, Persia); Damascus steel was made from Wootz
• Referenced in ancient Tamil literature and confirmed by laboratory analysis of archaeological specimens

II. Copper and Bronze Technology:

Archaeological Evidence:
• Bronze artifacts at Adichanallur: bowls, vessels, ornaments
• Copper objects at Kodumanal and other Iron Age sites

Chola Bronze Casting (Panchaloha):
• Chola period (9th–13th century CE) saw the pinnacle of South Indian bronze casting
• Panchaloha (பஞ்சலோகம்): five-metal alloy — copper (60%), zinc (11%), lead (11%), gold (1%), silver (1%) and other metals
• Lost-wax (cire perdue) technique used:
  1. Model sculpted in beeswax
  2. Clay mold built around wax model
  3. Wax melted and drained out (lost wax)
  4. Molten metal poured into mold
  5. Mold broken; metal sculpture revealed
  6. Detailed finishing and polishing

Famous Chola Bronzes:
• Nataraja (Dancing Shiva) – considered the supreme achievement of world bronze sculpture
• Ardhanarisvara – half male, half female form of Shiva
• Uma-Maheshwara (Shiva and Parvati seated)
• These are now preserved in world museums: British Museum, Metropolitan Museum, Guimet Museum

III. Gold and Silver Work:
• Ancient Tamil goldsmiths (Tamil: Thattar – தட்டார்) were highly skilled
• Gold ornaments found at Adichanallur and other burial sites
• Sangam literature describes elaborate gold ornaments: armlets (வளை), anklets (சிலம்பு), necklaces (மாலை)
• Techniques: filigree (இழைவேலை), granulation (small gold balls), casting, repoussé
• Gold coins: Chola, Pandya, and Chera kingdoms minted gold coins with dynasty emblems

IV. Beadmaking Technology:
• Kodumanal was a major bead manufacturing center
• Materials: carnelian (கோமேதகம்), quartz, crystal, garnet, amethyst, glass
• Bipolar electric discharge technique used to split hard stones
• Drilling using bow-drill with flint or copper bit
• Grinding and polishing to achieve final shape and surface
• Evidence of a complete manufacturing sequence from raw stone to finished bead

V. The Panchalas (Five Artisan Communities):
Ancient Tamil society had five specialized metal artisan communities (Panchalas):
1. Kammiyar (கம்மியர்) – Blacksmiths (iron work)
2. Thattar (தட்டார்) – Goldsmiths and silversmiths
3. Kollar (கொல்லர்) – Metalworkers (a related term)
4. Kanakar (கனகர்) – Another metal-working community
5. Tachchar (தச்சர்) – Carpenters (wood and metal combined work)

Conclusion:
The metallurgical achievements of ancient Tamils — from Iron Age bloom furnaces to medieval Chola bronze masterpieces, from Wootz steel to intricate gold jewelry — demonstrate a sustained tradition of technological innovation and artistic mastery spanning over two millennia. These achievements have been recognized globally, with Chola bronzes among the most celebrated art objects in world museums.

Keywords: iron smelting, Kodumanal, Adichanallur, Wootz steel, Chola bronze, Panchaloha, Nataraja, lost-wax, Kammiyar, bellows, carnelian beads`,
    answerTamil: `அறிமுகம்:
பண்டைய தமிழர்களின் உலோகவியல் திறன்கள் பண்டைய உலகில் மிகவும் சிறந்தவற்றில் ஒன்றாகும். தொல்லியல் அகழாய்வுகள், சங்க இலக்கியம் மற்றும் கல்வெட்டு நூல்களிலிருந்து சான்றுகள் பண்டைய தமிழர்கள் இரும்பு உருக்குவதில், செம்பு வார்ப்பில், வெண்கல தயாரிப்பில், தங்க வேலைப்பாட்டில் மற்றும் மணி தயாரிப்பில் வல்லுநர்கள் என்பதை வெளிப்படுத்துகின்றன.

I. இரும்பு தொழில்நுட்பம்:

சங்க இலக்கிய சான்றுகள்:
• அகநானூறு, புறநானூறு, பட்டினப்பாலை இரும்பு ஆயுதங்கள் மற்றும் கருவிகளை அடிக்கடி விவரிக்கின்றன
• இரும்பு தாது கொண்ட மலைகள் இரும்பு 'பயிர்' விளைவிப்பதாக விவரிக்கப்படுகின்றன
• இரவில் ஆயுதங்கள் இயற்றும் கொல்லர்களின் குறிப்புகள்

தொல்லியல் சான்றுகள்:

1. கோடுமணல் (ஈரோடு மாவட்டம்):
• பெரிய இரும்பு வேலை தளம்; உலைக்களங்கள் அகழாய்வு செய்யப்பட்டன
• இரும்பு குழம்பு மற்றும் திடமான இரும்பு பரவலாக கண்டெடுக்கப்பட்டன
• கருவிகள்: ஈட்டி நுனி, கத்திகள், அம்பு நுனி, வேளாண்மை கருவிகள்

2. ஆதிச்சநல்லூர் (திருநெல்வேலி):
• இடுகாட்டு கலசங்களில் இரும்பு கருவிகள்: வாள், ஈட்டி, அம்பு நுனி

3. பொருந்தல் (பழனி):
• நெல் தானியங்களுடன் இரும்பு கருவிகள்; கிமு. 490 ஆண்டு (கார்பன் காலக்கணிப்பு)

உருக்கு செயல்முறை:
1. இரும்பு தாது (மேக்னடைட் அல்லது லேட்டரைட்) மலைகளிலிருந்து சேகரிக்கப்படுகிறது
2. தாது சுட்டு சுத்தமாக்கப்படுகிறது
3. களிமண் சூளை; கரிக்கட்டை மற்றும் தாது மாறி மாறி அடுக்கப்படுகின்றன
4. தோல் துருத்தி (துருத்தி) வலுக்கட்டாய காற்றை வழங்குகிறது
5. துப்பாக்கி இரும்பு (ஸ்பாஞ்சு இரும்பு) சூடாக இருக்கும்போது வடிவமைக்கப்படுகிறது

Wootz இரும்பு (உக்கு):
• பண்டைய தமிழர்கள் Wootz (தமிழ் 'உக்கு' — இரும்பு) என்று அறியப்படும் உயர்தர இரும்பை உற்பத்தி செய்தனர்
• Wootz இரும்பு: மூடிய களிமண் குறுகுழுக்களில் கார்பனுடன் இணைந்த இரும்பு
• ரோமன் சாம்ராஜ்யம், பாரசீகத்திற்கு ஏற்றுமதி செய்யப்பட்டது; டமாஸ்கஸ் இரும்பு Wootz இரும்பிலிருந்து தயாரிக்கப்பட்டது

II. செம்பு மற்றும் வெண்கல தொழில்நுட்பம்:

சோழர் வெண்கல வார்ப்பு (பஞ்சலோகம்):
• பஞ்சலோகம்: ஐந்து உலோக கலவை — செம்பு (60%), துத்தநாகம் (11%), ஈயம் (11%), தங்கம் (1%), வெள்ளி (1%)
• இழந்த-மெழுகு (cire perdue) நுட்பம்:
  1. தேன்மெழுகில் மாதிரி செய்யப்படுகிறது
  2. மெழுகு மாதிரியைச் சுற்றி களிமண் அச்சு கட்டப்படுகிறது
  3. மெழுகு உருகி வடிந்துவிடுகிறது
  4. உருகிய உலோகம் வார்க்கப்படுகிறது
  5. அச்சு உடைக்கப்படுகிறது; உலோக சிற்பம் கிடைக்கிறது

பிரபல சோழர் வெண்கல சிற்பங்கள்:
• நடராஜர் (நடனம் செய்யும் சிவன்) — உலக வெண்கல சிற்ப கலையின் மிகவும் சிறந்த சாதனையாக கருதப்படுகிறது
• அர்த்தநாரீஸ்வரர்
• இவை இப்போது பிரிட்டிஷ் அருங்காட்சியகம், மெட்ரோபாலிட்டன் அருங்காட்சியகம் ஆகியவற்றில் உள்ளன

III. தங்க மற்றும் வெள்ளி வேலை:
• பண்டைய தமிழ் தட்டாரர் மிகவும் திறன்மிக்கவர்கள்
• ஆதிச்சநல்லூரில் தங்க அணிகலன்கள் கண்டெடுக்கப்பட்டன
• நுட்பங்கள்: நூல் வேலை, துணிக்கைத்திரி (சிறிய தங்க உருண்டைகள்), வார்ப்பு, repousse

IV. மணி தயாரிப்பு தொழில்நுட்பம்:
• கோடுமணல் முக்கிய மணி தயாரிப்பு மையம்
• பொருட்கள்: கோமேதகம், குவார்ட்ஸ், பளிங்கு, கார்னட், அமத்திஸ்ட், கண்ணாடி
• இருமுனை மின் இறக்கம் கடின கற்களை பிளக்க பயன்படுத்தப்பட்டது
• ஆடு-துரப்பணம் மூலம் துளையிடல்

முடிவுரை:
பண்டைய தமிழர்களின் உலோகவியல் சாதனைகள் — இரும்பு கால உலைக்களங்கள் முதல் சோழர் வெண்கல சிற்பங்கள் வரை, Wootz இரும்பு முதல் நுட்பமான தங்க நகைகள் வரை — இரண்டு ஆயிரம் ஆண்டுகளுக்கும் மேலாக நீண்டுவரும் தொழில்நுட்ப கண்டுபிடிப்பு மற்றும் கலை தேர்ச்சியின் நீடித்த பாரம்பரியத்தை நிரூபிக்கின்றன.

முக்கிய சொற்கள்: இரும்பு உருக்கு, கோடுமணல், ஆதிச்சநல்லூர், Wootz இரும்பு, சோழர் வெண்கலம், பஞ்சலோகம், நடராஜர், கம்மியர்`,
    keywordsEnglish: ["iron smelting", "Kodumanal", "Adichanallur", "Wootz steel", "Chola bronze", "Panchaloha", "Nataraja", "lost-wax", "Kammiyar", "bellows"],
    keywordsTamil: ["இரும்பு உருக்கு", "கோடுமணல்", "ஆதிச்சநல்லூர்", "Wootz இரும்பு", "சோழர் வெண்கலம்", "பஞ்சலோகம்", "நடராஜர்"],
  },

  {
    unit: "Unit III", qNo: 18, marks: 16,
    questionEnglish: "Write a note on ancient coins and their historical significance.",
    questionTamil: "நாணயங்கள் மற்றும் அவற்றின் வரலாற்று முக்கியத்துவம் பற்றிய குறிப்பை எழுதவும்.",
    answerEnglish: `Introduction:
Ancient coins (நாணயங்கள்) are among the most important sources of historical information about political authority, economic activity, religion, and cultural values in ancient Tamil Nadu and India. They serve as a bridge between literary evidence and material history, providing precise dating and identity of rulers and dynasties.

Evolution of Coinage:
The transition from barter (பண்டமாற்று) to coin-based monetary economy was a significant development in ancient Tamil civilization.

Types of Ancient Indian/Tamil Coins:

1. Punch-Marked Coins (குத்துமுத்திரை நாணயங்கள்):
• Oldest known coins in India (c. 600–300 BCE)
• Irregular-shaped silver pieces punched with symbols
• Symbols on punch-marked coins: sun, moon, hills, fish, elephant, tree
• Found extensively in Tamil Nadu at Uraiyur, Karur, and Madurai
• Used in the Sangam period economy

2. Tamil Dynastic Coins:

Pandya Coins:
• Emblem: Fish (மீன்) — the Pandya royal symbol
• Metal: Copper, silver
• Found mainly in Madurai region and Tirunelveli
• Inscriptions in Tamil-Brahmi or Tamil script naming the king

Chola Coins:
• Emblem: Standing tiger (புலி) — the Chola royal symbol
• Also: Bow (வில்) and fish symbols on early coins
• Metal: Gold (pon), silver (velli), copper (sembu)
• Found at Uraiyur, Karur, Thanjavur, Puhar
• Medieval Chola gold coins (Kalanju — கலஞ்சு) extensively minted

Chera Coins:
• Emblem: Bow and arrow (வில்) — Chera royal symbol
• Found in Kerala and western Tamil Nadu
• Smaller in production compared to Chola and Pandya coins

3. Roman Coins in Tamil Nadu:
• Large numbers of Roman gold coins (Aureus) and silver coins (Denarius) found at:
  - Karur (Roman coins hoard)
  - Uraiyur
  - Madurai (Vembaru hoard)
  - Coimbatore (500+ Roman coins)
  - Arikamedu (Puducherry)
• Roman emperors represented: Augustus, Tiberius, Caligula, Claudius, Nero, Vespasian
• Evidence of direct Roman-Tamil trade in the Sangam period (1st century BCE – 3rd century CE)
• Many Roman coins have been deliberately defaced (cut or pierced) suggesting they were used as ornaments rather than currency

4. Medieval Chola Gold Coins (Kalanju):
• Raja Raja Chola I and Rajendra Chola I produced large quantities of gold coins
• Designs feature the standing tiger (Chola emblem), umbrella, fish, and other royal symbols
• Inscriptions name the king: "Sri Rajarajadeva," "Sri Rajendradeva"
• Used to pay soldiers, priests, and merchants; donated to temples

5. Vijayanagara Coins (later period):
• Gold pagoda (Varaha): featured Vishnu or Balakrishna image
• Silver and copper coins with various designs
• Widely circulated in Tamil Nadu during Vijayanagara rule

Historical Significance of Coins:

1. Political History:
• Coins bear the names and emblems of rulers, confirming existence and sequence of dynasties
• Dynastic emblems (fish, tiger, bow) on coins match information in literary texts
• Coin distribution patterns show the geographical extent of kingdoms

2. Economic History:
• Transition from barter to monetary economy
• Evidence of trade routes from coin distribution
• Roman coins confirm international trade between Tamil ports and Rome
• Multiple coin metals (gold, silver, copper) indicate tiered monetary system

3. Religious History:
• Gods depicted on coins: Shiva, Vishnu, Lakshmi, local deities
• Temple donations recorded in inscriptions with coin values
• Kalanju (gold unit) and other coin denominations appear in temple inscriptions

4. Social History:
• Coins show standard weights and quality control measures
• Specific coin types for different transaction levels (gold for large trade; copper for daily use)

5. Cultural History:
• Artistic designs on coins reflect contemporary artistic sensibilities
• Roman coins found in Tamil Nadu show cultural exchange and openness to foreign goods
• Coins bearing Tamil script are evidence of Tamil literacy

Dating and Numismatics:
• Coins are primary evidence for dating archaeological layers
• Stratigraphy combined with coin finds gives precise chronology of site occupation
• Coin hoards (collections of buried coins) indicate periods of political instability or wealth storage

Notable Coin Hoards in Tamil Nadu:
• Vembaru Hoard (Madurai): large collection of Roman coins
• Karur Hoard: Roman and local coins
• Eyyal Hoard (Palakkad, Kerala): extensive Roman gold coin find

Conclusion:
Ancient Tamil coins are invaluable historical documents struck in metal. They confirm political timelines, economic connections, and religious practices, while providing direct physical evidence of international trade connections that enriched ancient Tamil civilization.

Keywords: punch-marked coins, Pandya fish symbol, Chola tiger, Roman coins, Uraiyur, Karur, gold Kalanju, Tamil-Brahmi, barter, monetary economy`,
    answerTamil: `அறிமுகம்:
பண்டைய நாணயங்கள் தமிழகம் மற்றும் இந்தியாவில் அரசியல் அதிகாரம், பொருளாதார செயல்பாடு, மதம் மற்றும் கலாச்சார மதிப்புகள் பற்றிய வரலாற்று தகவல்களின் மிக முக்கியமான ஆதாரங்களில் ஒன்றாகும்.

நாணயத்தின் பரிணாமம்:
பண்டமாற்றிலிருந்து நாணய அடிப்படையிலான பண பொருளாதாரத்திற்கு மாறுதல் பண்டைய தமிழ் நாகரிகத்தில் முக்கியமான வளர்ச்சியாகும்.

பண்டைய இந்திய/தமிழ் நாணயங்களின் வகைகள்:

1. குத்துமுத்திரை நாணயங்கள்:
• இந்தியாவில் மிகவும் பழமையான நாணயங்கள் (கிமு. 600–300)
• சங்க கால பொருளாதாரத்தில் பயன்படுத்தப்பட்டன
• தமிழகத்தில் உறையூர், கரூர், மதுரையில் பரவலாக கண்டெடுக்கப்பட்டன

2. தமிழ் வம்ச நாணயங்கள்:

பாண்டிய நாணயங்கள்:
• சின்னம்: மீன் — பாண்டிய அரசவின் சின்னம்
• உலோகம்: செம்பு, வெள்ளி

சோழர் நாணயங்கள்:
• சின்னம்: நின்ற புலி — சோழர் அரசவின் சின்னம்
• உலோகம்: தங்கம் (பொன்), வெள்ளி, செம்பு
• இடைக்கால சோழர் தங்க நாணயங்கள் (கலஞ்சு) பரவலாக வெளியிடப்பட்டன

சேர நாணயங்கள்:
• சின்னம்: வில்லும் அம்பும் — சேர அரசவின் சின்னம்

3. தமிழகத்தில் ரோமன் நாணயங்கள்:
• ரோமன் தங்க நாணயங்கள் (Aureus) மற்றும் வெள்ளி நாணயங்கள் கண்டெடுக்கப்பட்ட இடங்கள்:
  - கரூர் (ரோமன் நாணய கிடங்கு)
  - உறையூர்
  - மதுரை (வேம்பாறு கிடங்கு)
  - கோவை (500+ ரோமன் நாணயங்கள்)
  - அரிக்கமேடு
• சங்க காலத்தில் (கிமு. 1ஆம் நூற்றாண்டு – கிபி 3ஆம் நூற்றாண்டு) நேரடி ரோமன்-தமிழ் வணிகத்தின் சான்று

4. இடைக்கால சோழர் தங்க நாணயங்கள் (கலஞ்சு):
• ராஜராஜ சோழன் I மற்றும் ராஜேந்திர சோழன் I பெரிய அளவில் தங்க நாணயங்களை வெளியிட்டனர்
• வடிவமைப்புகளில் நின்ற புலி, குடை, மீன் மற்றும் பிற அரச சின்னங்கள்

நாணயங்களின் வரலாற்று முக்கியத்துவம்:

1. அரசியல் வரலாறு:
• நாணயங்கள் ஆட்சியாளர்களின் பெயர்களும் சின்னங்களும் கொண்டிருக்கின்றன
• வம்ச சின்னங்கள் (மீன், புலி, வில்) இலக்கிய நூல்களில் உள்ள தகவல்களை உறுதிப்படுத்துகின்றன

2. பொருளாதார வரலாறு:
• பண்டமாற்றிலிருந்து பண பொருளாதாரத்திற்கு மாறுதல்
• ரோமன் நாணயங்கள் தமிழ் துறைமுகங்களுக்கும் ரோமுக்கும் இடையே சர்வதேச வணிகத்தை உறுதிப்படுத்துகின்றன

3. மத வரலாறு:
• நாணயங்களில் சித்தரிக்கப்பட்ட தெய்வங்கள்: சிவன், விஷ்ணு, லட்சுமி
• கோவில் கல்வெட்டுகளில் நாணய மதிப்புகளுடன் கோவில் நன்கொடைகள்

4. கலாச்சார வரலாறு:
• நாணயங்களில் தமிழ் எழுத்து தமிழ் எழுத்தறிவுக்கான சான்று

முடிவுரை:
பண்டைய தமிழ் நாணயங்கள் உலோகத்தில் அடிக்கப்பட்ட விலைமதிப்பற்ற வரலாற்று ஆவணங்கள். அவை அரசியல் காலக்கணிப்பு, பொருளாதார தொடர்புகள் மற்றும் மத நடைமுறைகளை உறுதிப்படுத்துகின்றன.

முக்கிய சொற்கள்: குத்துமுத்திரை நாணயங்கள், பாண்டிய மீன் சின்னம், சோழர் புலி, ரோமன் நாணயங்கள், உறையூர், கரூர், தங்க கலஞ்சு`,
    keywordsEnglish: ["punch-marked coins", "Pandya fish symbol", "Chola tiger", "Roman coins", "Uraiyur", "Karur", "Kalanju", "monetary economy"],
    keywordsTamil: ["குத்துமுத்திரை நாணயங்கள்", "பாண்டிய மீன்", "சோழர் புலி", "ரோமன் நாணயங்கள்", "கலஞ்சு"],
  },

  {
    unit: "Unit III", qNo: 19, marks: 16,
    questionEnglish: "Explain the shapes/types of beads with references from archaeological findings.",
    questionTamil: "மணிகளின் வடிவங்கள்/ வகைகளை ஆதாரங்களுடன் விளக்கவும்.",
    answerEnglish: `Introduction:
Beads (மணிகள்) are among the most important artefacts found at ancient Tamil archaeological sites. They provide evidence of trade networks, material culture, artistic sensibility, and technological skill. Tamil Nadu has yielded some of the most significant ancient bead assemblages in South Asia, particularly from sites like Kodumanal, Arikamedu, Adichanallur, and Keeladi.

Materials Used for Beads:

1. Semi-Precious Stones:
• Carnelian (கோமேதகம்/சிவந்த கல்) – Most common; deep red/orange; sourced from Deccan traps
• Quartz (குவார்ட்ஸ்) – Crystal-clear variety
• Amethyst (அமத்திஸ்ட்) – Purple variety of quartz
• Garnet (கனகம்) – Deep red gemstone
• Lapis Lazuli – Deep blue; imported from Afghanistan
• Agate (அக்கேட்) – Banded variety of chalcedony

2. Glass:
• Colored glass beads produced locally at Arikamedu (blue, green, amber)
• Roman glass beads imported through trade
• Silica-based; colored with metallic oxides (cobalt for blue, copper for green)

3. Precious Materials:
• Gold beads – For the elite and royalty
• Silver beads – Less common
• Pearl (முத்து) – From Gulf of Mannar oysters

4. Organic Materials:
• Shell (சிப்பி) – From marine shells, conch
• Ivory (தந்தம்) – Carved elephant ivory beads
• Bone – Animal and bird bone beads
• Coral (பவளம்) – Marine coral; imported from Red Sea/Mediterranean

5. Terracotta:
• Sun-baked or kiln-fired clay beads
• Found extensively at Keeladi and Adichanallur
• Most common, most affordable; used by general population

6. Other Minerals:
• Steatite (soapstone – குளவி கல்) – Soft stone; easy to carve

Shapes and Types of Beads (Archaeological Classification):

1. Cylindrical (உருளை வடிவம்):
• Elongated circular cross-section; length greater than diameter
• Most common shape for carnelian and crystal beads
• Found in abundance at Kodumanal
• Used in multi-strand necklaces as spacer beads

2. Spherical / Round (உருண்டை வடிவம்):
• Perfect sphere; equal diameter in all directions
• Common in glass, terracotta, gold
• Found at Arikamedu (glass spheres) and Adichanallur (terracotta spheres)
• Often threaded in simple single-strand necklaces

3. Disc-shaped / Flat (தட்டை வடிவம்):
• Very thin, flat, circular bead; width greater than height
• Made from shell, stone, and metal
• Used in stackable bracelets and collar-style necklaces

4. Barrel-shaped (பீப்பாய் வடிவம்):
• Wider at center, tapering at both ends; resembles a barrel
• Common in carnelian and glass
• Found at Kodumanal and Porunthal
• More elaborate than basic cylinder; indicates skilled craftsmanship

5. Bicone / Double Cone (இரட்டை கூம்பு):
• Two cones joined at the widest point; like two pyramids meeting at base
• Found in glass and stone at Arikamedu
• Elegant geometric form; likely for decorative emphasis in strands

6. Faceted / Multi-faced (பல முகங்கள்):
• Angular surfaces deliberately ground onto the bead surface
• Creates light-reflecting facets
• Found in carnelian and crystal at Kodumanal
• Technologically advanced: required precision grinding

7. Long Tube / Elongated (நீண்ட குழாய்):
• Very long cylindrical bead, sometimes 5–10 cm
• Made from carnelian, crystal, or bone
• Used as central focal bead in necklaces

8. Melon / Ribbed (வரிசை வடிவம்):
• Spherical with longitudinal ribs; resembles a melon
• Found in glass and stone

9. Biconvex (இரட்டை குழிவு):
• Lentil-shaped; flat on both top and bottom, with convex sides
• Common in terracotta

Special Bead Types:

Eye Beads (கண்ணீட்டி மணி):
• Beads with concentric circle patterns resembling an eye
• Made of glass (wound glass technique)
• Believed to ward off evil eye (தீட்டு)
• Found at Arikamedu; imported Roman glass eye beads also found

Gold Foil Beads:
• Glass or quartz core covered with thin gold foil
• Found at Adichanallur; indicate luxury manufacture

Manufacturing Technology:

1. Knapping (Stone Bead Blanks):
• Large stone nodules (carnelian) fractured into small blanks using indirect percussion
• Bipolar technique: stone placed on anvil and struck from above, splitting along natural planes

2. Drilling:
• Bow-drill with copper or flint bit
• Tubular drill using hollow reeds with sand abrasive
• Evidence of partially drilled beads (manufacturing failures) at Kodumanal

3. Grinding and Polishing:
• Sandstone grinding slabs found at Kodumanal
• Progressive polishing from coarse to fine grit achieves glossy surface

4. Heat Treatment of Carnelian:
• Carnelian heated to 400–500°C changes from yellow-brown to deep red
• Increases desirability and value
• Calcified beads found at Kodumanal show evidence of this process

Archaeological Sites and Their Bead Assemblages:

Kodumanal (Erode district):
• India's most important ancient bead-manufacturing site
• Complete manufacturing sequence: raw stone → blank → rough bead → finished bead
• Carnelian, quartz, crystal, and garnet beads
• Evidence of trade with distant sources (lapis lazuli from Afghanistan)

Arikamedu (Puducherry):
• Both local and imported beads
• Roman glass beads in abundance
• Evidence of Indo-Roman bead trade

Adichanallur (Tirunelveli):
• Terracotta, shell, and gold beads in burial urns
• Indicate burial customs involving precious ornaments

Conclusion:
Ancient Tamil bead technology demonstrates a sophisticated understanding of materials science, precision manufacturing, and aesthetic sensibility. The variety of materials, shapes, and manufacturing techniques reflects both local craft traditions and international trade connections, making Tamil Nadu one of the most significant ancient bead-manufacturing regions in the world.

Keywords: carnelian, cylindrical, spherical, bicone, faceted, Kodumanal, Arikamedu, glass beads, bipolar technique, eye beads, heat treatment`,
    answerTamil: `அறிமுகம்:
மணிகள் பண்டைய தமிழ் தொல்லியல் தளங்களில் கண்டெடுக்கப்பட்ட மிக முக்கியமான கலைப்பொருட்களில் ஒன்றாகும். இவை வணிக வலையமைப்புகள், பொருள் கலாச்சாரம், கலை ரசனை மற்றும் தொழில்நுட்ப திறன் பற்றிய சான்றுகளை வழங்குகின்றன.

மணிகளில் பயன்படுத்தப்படும் பொருட்கள்:

1. அரை-விலையுயர்ந்த கற்கள்:
• கோமேதகம் – மிகவும் பொதுவானது; ஆழமான சிவப்பு/ஆரஞ்சு
• குவார்ட்ஸ் – தெளிந்த வகை
• கோவேதகம் – ஆழமான சிவப்பு
• நீலக் கல் (Lapis Lazuli) – ஆப்கானிஸ்தானிலிருந்து இறக்குமதி

2. கண்ணாடி:
• அரிக்கமேடில் உற்பத்தி செய்யப்பட்ட நிறமுள்ள கண்ணாடி மணிகள்
• ரோமன் கண்ணாடி மணிகள் வணிகம் மூலம் இறக்குமதி

3. விலைமதிப்பற்ற பொருட்கள்:
• தங்க மணிகள் – உயரடுக்கிற்கும் அரசவிற்கும்
• முத்து – மன்னார் வளைகுடா சிப்பிகளிலிருந்து

4. கரிம பொருட்கள்:
• சிப்பி, தந்தம், மூங்கில், பவளம்

5. மட்பாண்டம்:
• சூரிய ஒளியில் காய்ந்த அல்லது சூளையில் சுட்ட களிமண் மணிகள்
• கீழடி மற்றும் ஆதிச்சநல்லூரில் பரவலாக கண்டெடுக்கப்பட்டன

மணிகளின் வடிவங்கள் (தொல்லியல் வகைப்பாடு):

1. உருளை வடிவம் (Cylindrical):
• நீண்ட வட்ட குறுக்குவெட்டு
• கோடுமணலில் பரவலாக கண்டெடுக்கப்பட்டன
• பல-திரி மாலைகளில் இடைவெளி மணிகளாக பயன்படுகின்றன

2. உருண்டை வடிவம் (Spherical):
• அனைத்து திசைகளிலும் சம விட்டம்
• கண்ணாடி, மட்பாண்டம், தங்கம்
• அரிக்கமேடில் (கண்ணாடி கோளங்கள்) மற்றும் ஆதிச்சநல்லூரில் கண்டெடுக்கப்பட்டன

3. தட்டை வடிவம் (Disc):
• மிகவும் மெல்லியது, தட்டையான, வட்டமான மணி
• சிப்பி, கல், உலோகம்

4. பீப்பாய் வடிவம் (Barrel):
• மையத்தில் அகன்று இரு முனைகளில் குறுகுகிறது
• கோடுமணல் மற்றும் பொருந்தலில் கண்டெடுக்கப்பட்டன

5. இரட்டை கூம்பு (Bicone):
• இரண்டு கூம்புகள் அகலமான புள்ளியில் இணைகின்றன
• அரிக்கமேடில் கண்ணாடி மற்றும் கல்

6. பல முகங்கள் (Faceted):
• மணி மேற்பரப்பில் கோண மேற்பரப்புகள் தவிடுவடிவமாக தரைவாரப்படுகின்றன
• கோடுமணலில் கோமேதகம் மற்றும் குவார்ட்ஸ்

7. நீண்ட குழாய் (Elongated tube):
• மிக நீண்ட உருளை மணி

கண்ணீட்டி மணிகள் (Eye Beads):
• ஒரு கண்ணை ஒத்த மையக்கோட்டு வட்ட வடிவங்கள் கொண்ட மணிகள்
• தீட்டு தவிர்ப்பதற்காக என்று நம்பப்பட்டது

தயாரிப்பு தொழில்நுட்பம்:

1. கல் மணி வெற்றிடங்கள் (Stone Bead Blanks):
• பெரிய கல் திட்டுகளை (கோமேதகம்) இடைப்பட்ட தாக்குதல் மூலம் சிறிய வெற்றிடங்களாக பிளத்தல்
• இருமுனை நுட்பம்: கல்லை ஒரு நெட்டணியில் வைத்து மேலிருந்து தாக்குதல்

2. துளையிடல்:
• ஆடு-துரப்பணம் மூலம் செம்பு அல்லது மின்கல் முனை
• பகுதியாக துளையிடப்பட்ட மணிகள் (தயாரிப்பு தோல்விகள்) கோடுமணலில் கண்டெடுக்கப்பட்டன

3. அரைத்தல் மற்றும் மெருகூட்டல்:
• கோடுமணலில் மணல்கல் அரைக்கும் பலகைகள் கண்டெடுக்கப்பட்டன

4. கோமேதகத்தின் வெப்ப சிகிச்சை:
• 400–500°C வரை சூடாக்கப்பட்ட கோமேதகம் மஞ்சள்-பழுப்பு நிறத்திலிருந்து ஆழமான சிவப்பு நிறமாக மாறுகிறது
• கோடுமணலில் சுண்ணாம்பு படிந்த மணிகள் இந்த செயல்முறையின் சான்றுகளை காட்டுகின்றன

முக்கிய தொல்லியல் தளங்கள் மற்றும் மணி தொகுப்புகள்:
• கோடுமணல் – இந்தியாவின் மிக முக்கியமான பண்டைய மணி தயாரிப்பு தளம்
• அரிக்கமேடு – உள்ளூர் மற்றும் இறக்குமதி செய்யப்பட்ட மணிகள்; ரோமன் கண்ணாடி மணிகள்
• ஆதிச்சநல்லூர் – இடுகாட்டு கலசங்களில் மட்பாண்டம், சிப்பி, தங்க மணிகள்

முடிவுரை:
பண்டைய தமிழ் மணி தொழில்நுட்பம் பொருட்கள் அறிவியல், துல்லியமான தயாரிப்பு மற்றும் அழகியல் ரசனையில் நுட்பமான புரிதலை நிரூபிக்கிறது. பொருட்கள், வடிவங்கள் மற்றும் தயாரிப்பு நுட்பங்களின் வகைத்தன்மை உள்ளூர் கைவினை பாரம்பரியங்கள் மற்றும் சர்வதேச வணிக தொடர்புகளை பிரதிபலிக்கிறது.

முக்கிய சொற்கள்: கோமேதகம், உருளை, உருண்டை, இரட்டை கூம்பு, கோடுமணல், அரிக்கமேடு, கண்ணாடி மணிகள், இருமுனை நுட்பம்`,
    keywordsEnglish: ["carnelian", "cylindrical", "spherical", "bicone", "faceted", "Kodumanal", "Arikamedu", "glass beads", "bipolar technique", "eye beads"],
    keywordsTamil: ["கோமேதகம்", "உருளை", "உருண்டை", "இரட்டை கூம்பு", "கோடுமணல்", "அரிக்கமேடு", "கண்ணீட்டி மணி"],
  },

  {
    unit: "Unit III", qNo: 20, marks: 16,
    questionEnglish: "Explain the details about beads mentioned by Ilango Adigal in the 'Urukan Kādai' chapter of Silappathikaram.",
    questionTamil: "ஊர்காண் காதையில் இளங்கோ அடிகள் கூறும் மணிகள் பற்றிய செய்திகளை விளக்குக.",
    answerEnglish: `Introduction:
The Urukan Kādai (ஊர்காண் காதை — "The Canto of the City's Sights") is a chapter from the first book (Puhar Kandam) of Silappathikaram (சிலப்பதிகாரம்), composed by Ilango Adigal. The chapter describes the protagonist Kovalan's tour of the magnificent port city of Puhar (Kaveripoompattinam), providing a vivid picture of urban life, mercantile prosperity, and the jewellery and ornamentation of women.

The Significance of the Urukan Kādai Chapter:
• It is one of the most detailed descriptions of an ancient Indian city and its material culture
• Provides an unparalleled catalogue of ornaments, gemstones, and textiles
• Reveals the economic connection between gem trade and the prosperity of port cities
• Gives insight into the aesthetic values, social hierarchy, and cosmopolitan character of ancient Puhar

Context:
Kovalan, having left his wife Kannagi under the influence of the dancer Madhavi, wanders through Puhar. As he observes the city, Ilango Adigal uses his perspective to describe the jewels and ornaments worn by the women of different social classes, showcasing the wealth of the city.

Types of Beads and Gems Described:

1. Muktha (முத்து) — Pearl Beads:
• Pearl was the most prestigious and widely referenced gemstone
• Pearls were sourced from the Gulf of Mannar — famous worldwide in ancient times
• The Urukan Kādai describes women wearing multi-strand pearl necklaces (முத்து மாலை)
• Pearl earrings (முத்துக் குண்டலம்) dangling like drops of water are described
• Pearl armlets and hair ornaments are also referenced
• Sangam literature confirms that pearl diving (முத்துக்குளிப்பு) was a major industry at Korkai and Musiri

2. Manikam (மாணிக்கம்) — Ruby:
• Described as glowing red like fire
• Set in gold ornaments
• Ruby necklaces and earrings described

3. Marakadham (மரகதம்) — Emerald:
• Cool green gems contrasting with ruby
• Referenced in combinations with gold and pearl in necklaces

4. Vairam (வைரம்) — Diamond:
• The rarest and most valued gem
• Described as brilliant and sparkling
• Used in elite women's ornaments

5. Pavalam (பவளம்) — Coral:
• Red coral beads — imported from the Mediterranean/Red Sea
• Used in necklaces and bracelets
• Affordable for middle-class women; also found in children's ornaments (talisman beads)

6. Neelam (நீலம்) — Sapphire / Blue Gem:
• Deep blue gem
• Set in gold jewelry for the prosperous merchant class

7. Gomethagam (கோமேதகம்) — Hessonite Garnet / Carnelian:
• Orange-red semi-precious stone
• The most archaeologically confirmed bead from Tamil Nadu (Kodumanal)
• Available locally; traded widely

8. Gold Ornaments (தங்க நகைகள்):
• The chapter describes golden armlets (தோள்வளை / ஆடலிழை)
• Golden waist belts studded with gems
• Gold hair ornaments (சூடகம்)
• Forehead ornament (நெற்றிச்சேர்க்கை)

9. Silk Thread and Colored Thread Ornaments:
• Some ornamental cords made of fine silk thread in colors

Types of Jewelry Described in Urukan Kādai:

Neck Ornaments:
• Maanai (மாணை) – Close-fitting choker
• Maalai (மாலை) – Long necklace in multiple strands
• Koyil Maalai — temple garland necklace

Ear Ornaments:
• Kundalam (குண்டலம்) – Classic circular earrings
• Todu (தோடு) – Elaborate dangling earrings
• Matippu (மதிப்பு) – Pearl drop earrings

Arm Ornaments:
• Tholvalai (தோள்வளை) – Armlets
• Valai (வளை) – Bangles; described in stacks on both wrists

Waist Ornaments:
• Mekalai (மேகலை) – Waist girdle/belt with dangling pendants
• Araikkoli (இடைக்கிடை) – String of gems around the waist

Head Ornaments:
• Sudu (சுடு) – Floral arrangement with gems
• Netriyasaiyal (நெற்றி நல்லணி) – Forehead decoration

Ankle Ornaments:
• Silambu (சிலம்பு) – The anklet at the center of the epic's plot; filled with pearls; the sound of its bells is described poetically
• Koluso (கொலுசு) – Ankle chain

The Silamphu (சிலம்பு) — The Key Bead Object:
• The anklet filled with rubies is a central plot element
• Kannagi's anklet is filled with rubies; Madhavi's is filled with pearls
• The story's tragedy hinges on this difference: Kovalan's anklet (Kannagi's, with rubies) is mistakenly identified as the Queen's stolen anklet (with pearls)

Economic Significance:
• The variety of gems and beads described indicates Puhar was a major gem trading center
• Gems from Sri Lanka (sapphire, ruby), Gulf of Mannar (pearl), Egypt (emerald), India (diamond, carnelian) all converged at Puhar
• The gem and jewelry trade was central to the prosperity of the merchant community (Ainooruvar, Manigrama Vanigar)

Archaeological Correlation:
• The gems described in Silappathikaram match the archaeological record from Arikamedu (glass beads, Roman gems)
• Pearl processing evidence at Korkai
• Carnelian beads at Kodumanal match the gomethagam/manikam categories
• Gold ornaments in burial urns at Adichanallur match Sangam-era descriptions

Conclusion:
The Urukan Kādai chapter of Silappathikaram is a priceless literary gem in itself — a detailed inventory of ancient Tamil material culture. Ilango Adigal's descriptions of beads and ornaments are not merely decorative; they serve to reveal the economic, social, and cultural richness of ancient Puhar, while also providing archaeological corroboration through the gems and ornament types identified by modern excavations.

Keywords: Urukan Kadai, Silappathikaram, pearl, ruby, carnelian, sapphire, Silambu, Puhar, Kovalan, Kannagi, gem trade, Manikam, Muththu`,
    answerTamil: `அறிமுகம்:
ஊர்காண் காதை (நகரின் காட்சிகளின் பாடல்) என்பது இளங்கோ அடிகல் இயற்றிய சிலப்பதிகாரத்தின் (முதல் புத்தகம் — புகார் கண்டம்) ஒரு அத்தியாயம். இந்த அத்தியாயம் புகாரின் (காவேரிப்பூம்பட்டினம்) அற்புதமான துறைமுக நகரின் கோவலனின் சுற்றுப்பயணத்தை விவரிக்கிறது.

ஊர்காண் காதை அத்தியாயத்தின் முக்கியத்துவம்:
• இது ஒரு பண்டைய இந்திய நகரம் மற்றும் அதன் பொருள் கலாச்சாரத்தின் மிகவும் விரிவான விளக்கங்களில் ஒன்றாகும்
• அணிகலன்கள், இரத்தினக்கற்கள் மற்றும் ஜவுளிகளின் ஒப்பற்ற பட்டியலை வழங்குகிறது
• இரத்தினக்கல் வணிகத்திற்கும் துறைமுக நகரங்களின் செழிப்பிற்கும் இடையிலான பொருளாதார தொடர்பை வெளிப்படுத்துகிறது

விவரிக்கப்படும் மணிகள் மற்றும் இரத்தினங்கள்:

1. முத்து (Pearl Beads):
• மிகவும் மதிப்பமைக்கப்பட்ட மற்றும் பரவலாக குறிப்பிடப்பட்ட இரத்தினக்கல்
• மன்னார் வளைகுடாவிலிருந்து பெறப்பட்டது
• பல-திரி முத்து மாலைகளை அணிந்த பெண்களை விவரிக்கிறது
• முத்துக் குண்டலம் – தண்ணீர் துளிகளாக தொங்கும் முத்து காதணிகள்

2. மாணிக்கம் (Ruby):
• நெருப்பைப் போல் சிவந்து ஒளிரும் என்று விவரிக்கப்படுகிறது
• தங்க அணிகலன்களில் வைக்கப்பட்டது

3. மரகதம் (Emerald):
• ரூபியுடன் இளம் பச்சை நிற இரத்தினம்
• மாலைகளில் தங்கம் மற்றும் முத்துடன் இணைக்கப்பட்டது

4. வைரம் (Diamond):
• அரிதான மற்றும் மிகவும் மதிப்பமைக்கப்பட்ட இரத்தினக்கல்
• பளிப்பான மற்றும் ஒளிரும் என்று விவரிக்கப்படுகிறது

5. பவளம் (Coral):
• சிவப்பு பவள மணிகள் — மத்திய தரைக்கடலிலிருந்து இறக்குமதி
• மாலைகள் மற்றும் வளையல்களில் பயன்படுத்தப்படுகிறது

6. நீலம் (Sapphire):
• ஆழமான நீல நிற இரத்தினக்கல்
• செழிப்பான வணிக வர்க்கத்தின் தங்க நகைகளில் வைக்கப்பட்டது

7. கோமேதகம் (Carnelion/Hessonite Garnet):
• ஆரஞ்சு-சிவப்பு அரை-விலையுயர்ந்த கல்
• தமிழகத்தில் (கோடுமணல்) தொல்லியல் அளவில் மிகவும் உறுதிப்படுத்தப்பட்ட மணி

ஊர்காண் காதையில் விவரிக்கப்படும் நகை வகைகள்:

கழுத்து அணிகலன்கள்:
• மாணை – நெருக்கமான சரக்கு
• மாலை – பல திரிகளில் நீண்ட மாலை
• கோயில் மாலை

காது அணிகலன்கள்:
• குண்டலம் – கிளாசிக் வட்ட காதணிகள்
• தோடு – விரிவான தொங்கும் காதணிகள்

கை அணிகலன்கள்:
• தோள்வளை – கைவளை
• வளை – இரு கைகளிலும் குவிந்த வளையல்கள்

இடை அணிகலன்கள்:
• மேகலை – தொங்கும் கலன்களுடன் இடைக்கட்டு

தலை அணிகலன்கள்:
• நெற்றிப் பட்டம் – நெற்றி அலங்காரம்

கணுக்கால் அணிகலன்கள்:
• சிலம்பு – காப்பியத்தின் மையமான கணுக்கால்; முத்துகள் நிரப்பப்பட்டது; அதன் மணியோசை கவிதையாக விவரிக்கப்படுகிறது

சிலம்பு — முக்கிய மணி பொருள்:
• ரூபிகள் நிரப்பப்பட்ட கணுக்காற்கட்டு கதையின் மைய கூறு
• கண்ணகியின் சிலம்பு ரூபிகள் நிரப்பப்பட்டது; மாதவியினது முத்துகள்
• இந்த வித்தியாசத்தில் கதையின் அழிவு தங்கியிருக்கிறது

தொல்லியல் தொடர்பு:
• சிலப்பதிகாரத்தில் விவரிக்கப்படும் இரத்தினக்கற்கள் அரிக்கமேடு தொல்லியல் பதிவுகளுடன் ஒத்துப்போகின்றன
• கோடுமணலில் உள்ள கோமேதக மணிகள் கோமேதகம்/மாணிக்கம் வகைகளுடன் ஒத்துப்போகின்றன
• ஆதிச்சநல்லூரில் இடுகாட்டு கலசங்களில் தங்க அணிகலன்கள் சங்க கால விளக்கங்களுடன் ஒத்துப்போகின்றன

முடிவுரை:
ஊர்காண் காதை தன்னில் ஒரு விலைமதிப்பற்ற இலக்கிய இரத்தினம் — பண்டைய தமிழ் பொருள் கலாச்சாரத்தின் விரிவான பட்டியல். இளங்கோ அடிகல்லின் மணிகள் மற்றும் அணிகலன்கள் பற்றிய விளக்கங்கள் வெறும் அலங்காரமல்ல; அவை பண்டைய புகாரின் பொருளாதார, சமூக மற்றும் கலாச்சார செழிப்பை வெளிப்படுத்துகின்றன.

முக்கிய சொற்கள்: ஊர்காண் காதை, சிலப்பதிகாரம், முத்து, மாணிக்கம், கோமேதகம், சிலம்பு, புகார், கோவலன், கண்ணகி`,
    keywordsEnglish: ["Urukan Kadai", "Silappathikaram", "pearl", "ruby", "carnelian", "sapphire", "Silambu", "Puhar", "Kovalan", "Kannagi", "gem trade"],
    keywordsTamil: ["ஊர்காண் காதை", "சிலப்பதிகாரம்", "முத்து", "மாணிக்கம்", "கோமேதகம்", "சிலம்பு", "புகார்", "கோவலன்", "கண்ணகி"],
  },

  // ─── UNIT IV ───
  {
    unit: "Unit IV", qNo: 1, marks: 2,
    questionEnglish: "Write a note about Kallanai (the Grand Anicut).",
    questionTamil: "கல்லணைகுறித்துக் குறிப்பு எழுக.",
    answerEnglish: "Kallanai (கல்லணை), the Grand Anicut, is one of the world's oldest water regulation structures built across the Kaveri River in Thanjavur district by Chola king Karikalan (~2nd century CE). Made of rough-cut stone without mortar, it diverts Kaveri waters for irrigation. Still functional after 2,000 years.",
    answerTamil: "கல்லணை உலகின் பழமையான நீர் கட்டுப்பாட்டு கட்டமைப்புகளில் ஒன்று. தஞ்சாவூர் மாவட்டத்தில் காவிரியில் சோழ அரசன் கரிகாலனால் கி.பி. 2ஆம் நூற்றாண்டில் கட்டப்பட்டது. சாந்து இல்லாமல் கற்களால் கட்டப்பட்டது. 2000 ஆண்டுகளுக்கும் மேலாக இன்றும் செயல்படுகிறது.",
    keywordsEnglish: ["Kallanai", "Grand Anicut", "Karikalan", "Kaveri", "2000 years"],
    keywordsTamil: ["கல்லணை", "கரிகாலன்", "காவிரி", "2000 ஆண்டுகள்"],
  },
  {
    unit: "Unit IV", qNo: 2, marks: 2,
    questionEnglish: "Who were the Neer Vettiyar?",
    questionTamil: "நீர் வெட்டியார் என்பவர் யார்?",
    answerEnglish: "Neer Vettiyar (நீர் வெட்டியார்) were water distributors in ancient Tamil Nadu responsible for regulating and distributing irrigation water fairly among farmers. They maintained water channels, opened and closed sluices, and resolved water-related disputes.",
    answerTamil: "நீர் வெட்டியார் என்பவர் பண்டைய தமிழகத்தில் விவசாயிகளுக்கு நீர்ப்பாசன நீரை நியாயமாக விநியோகிக்கும் பொறுப்பில் இருந்த நீர் அதிகாரிகள். கால்வாய்கள் பராமரித்தனர், மடைகள் திறந்து மூடினர், நீர் தகராறுகளை தீர்த்தனர்.",
    keywordsEnglish: ["Neer Vettiyar", "water distributor", "irrigation", "canal officer"],
    keywordsTamil: ["நீர் வெட்டியார்", "நீர் விநியோகி", "பாசனம்", "கால்வாய்"],
  },
  {
    unit: "Unit IV", qNo: 3, marks: 2,
    questionEnglish: "Write a note about Kumizhi Thoombu.",
    questionTamil: "குமிழித்தூம்பு குறிப்பு எழுக.",
    answerEnglish: "Kumizhi Thoombu (குமிழித்தூம்பு) is an ancient Tamil water-lifting device used to raise water from lower levels to irrigate elevated fields. It operated using counterweights or manual labor. This traditional irrigation technology is mentioned in Sangam literature.",
    answerTamil: "குமிழித்தூம்பு என்பது பண்டைய தமிழர் பயன்படுத்திய நீர் உயர்த்தும் கருவி. கீழ் தளத்திலிருந்து நீரை உயர்த்தி உயர்ந்த வயல்களுக்கு பாசனம் செய்யப் பயன்பட்டது. எதிர் எடைகள் அல்லது கை உழைப்பால் இயங்கியது. சங்க இலக்கியத்தில் குறிப்பிடப்படுகிறது.",
    keywordsEnglish: ["Kumizhi Thoombu", "water lifting", "irrigation", "Sangam"],
    keywordsTamil: ["குமிழித்தூம்பு", "நீர் உயர்த்தும் கருவி", "பாசனம்"],
  },
  {
    unit: "Unit IV", qNo: 4, marks: 2,
    questionEnglish: "Who constructed the Thiraiyan Eri?",
    questionTamil: "திரையன் ஏரியை அமைத்தவர் யார்?",
    answerEnglish: "Thiraiyan Eri (திரையன் ஏரி) was constructed by a local chieftain named Thiraiyan. Sangam literature references tank construction by local rulers as acts of benevolence to the farming community. Such tanks were vital for storing rainwater and ensuring year-round irrigation.",
    answerTamil: "திரையன் ஏரி திரையன் என்ற உள்ளூர் தலைவரால் கட்டப்பட்டது. சங்க இலக்கியம் உள்ளூர் ஆட்சியாளர்கள் விவசாய சமூகத்திற்கு சேவையாக ஏரிகள் கட்டியதை குறிப்பிடுகிறது. இந்த ஏரிகள் மழை நீர் சேமித்து ஆண்டு முழுவதும் பாசனம் உறுதி செய்தன.",
    keywordsEnglish: ["Thiraiyan", "Eri", "tank", "Sangam", "irrigation"],
    keywordsTamil: ["திரையன்", "ஏரி", "சங்க காலம்", "பாசனம்"],
  },
  {
    unit: "Unit IV", qNo: 5, marks: 2,
    questionEnglish: "Which kings ruled by establishing the Seven Committees?",
    questionTamil: "ஏழு வாரியங்கள் அமைத்து ஆட்சி செய்த மன்னர்கள் யார்?",
    answerEnglish: "The Seven Committees (ஏழு வாரியங்கள்) were established by the Chola kings. Uttaramerur inscriptions (Kanchipuram district) mention Parantaka Chola I establishing these committees for local governance — managing village affairs, tanks, garden lands, and welfare activities.",
    answerTamil: "ஏழு வாரியங்கள் சோழ அரசர்களால் நிறுவப்பட்டன. உத்தரமேரூர் கல்வெட்டுகள் (காஞ்சிபுரம் மாவட்டம்) பராந்தக சோழன் I நிறுவிய இந்த குழுக்களை குறிப்பிடுகின்றன. கிராம விவகாரங்கள், குளங்கள், தோட்ட நிலங்கள் மற்றும் நலன்புரி நிர்வகித்தன.",
    keywordsEnglish: ["Seven Committees", "Chola", "Uttaramerur", "Parantaka"],
    keywordsTamil: ["ஏழு வாரியங்கள்", "சோழர்", "உத்தரமேரூர்", "பராந்தக சோழன்"],
  },
  {
    unit: "Unit IV", qNo: 6, marks: 2,
    questionEnglish: "Who were the Neeranikkararkal?",
    questionTamil: "நீரணிக்காரர்கள் என்பவர் யார்?",
    answerEnglish: "Neeranikkararkal (நீரணிக்காரர்கள்) were traditional water supervisors in ancient Tamil Nadu who monitored the flow and distribution of water in irrigation channels and tanks. They ensured all farmers received their allocated water share, especially in delta regions.",
    answerTamil: "நீரணிக்காரர்கள் என்பவர் பண்டைய தமிழகத்தில் பாசன கால்வாய்கள் மற்றும் குளங்களில் நீரின் ஓட்டம் மற்றும் விநியோகத்தை கண்காணிக்கும் பாரம்பரிய நீர் மேலாளர்கள். அனைத்து விவசாயிகளும் ஒதுக்கப்பட்ட நீர் பங்கை பெற உறுதி செய்தனர்.",
    keywordsEnglish: ["Neeranikkararkal", "water supervisor", "irrigation", "delta"],
    keywordsTamil: ["நீரணிக்காரர்கள்", "நீர் கண்காணிப்பாளர்", "பாசனம்", "டெல்டா"],
  },
  {
    unit: "Unit IV", qNo: 7, marks: 2,
    questionEnglish: "Write a note about Madai (sluice gate).",
    questionTamil: "மடை குறிப்பு எழுக.",
    answerEnglish: "Madai (மடை) is the sluice gate or valve mechanism in ancient Tamil irrigation tanks that controls water flow from a tank into irrigation channels. Proper madai maintenance ensured controlled water release, preventing flooding while sustaining agricultural supply.",
    answerTamil: "மடை என்பது பண்டைய தமிழ் பாசன குளங்களில் நீரின் ஓட்டத்தை கட்டுப்படுத்தும் தூம்பு வாயில் அல்லது வால்வு அமைப்பு. சரியான பராமரிப்பு வெள்ளத்தை தடுத்து வேளாண்மை நீர் விநியோகம் நிலைத்திருக்க உதவியது.",
    keywordsEnglish: ["Madai", "sluice gate", "tank", "irrigation", "water control"],
    keywordsTamil: ["மடை", "தூம்பு வாயில்", "குளம்", "பாசனம்"],
  },
  {
    unit: "Unit IV", qNo: 8, marks: 2,
    questionEnglish: "Write a note about water resources in ancient Tamil society.",
    questionTamil: "நீர் வளம் பற்றிக் குறிப்பு எழுக.",
    answerEnglish: "Ancient Tamils used diverse water resources: (1) Eri (ஏரி) – tanks; (2) Kulam (குளம்) – small ponds; (3) Rivers – Kaveri, Vaigai, Tamirabarani; (4) Wells (கிணறு) – drinking water; (5) Canals (கால்வாய்) – distribution. Water management was central to Sangam-era governance.",
    answerTamil: "பண்டைய தமிழர்கள் பல நீர் ஆதாரங்களை பயன்படுத்தினர்: (1) ஏரி – சேமிப்பு; (2) குளம் – சிறிய தடாகம்; (3) காவிரி, வைகை, தாமிரபரணி – நதிகள்; (4) கிணறு – குடிநீர்; (5) கால்வாய் – விநியோகம். நீர் மேலாண்மை சங்க கால நிர்வாகத்தின் மையம்.",
    keywordsEnglish: ["Eri", "Kulam", "wells", "canals", "Kaveri"],
    keywordsTamil: ["ஏரி", "குளம்", "கிணறு", "கால்வாய்", "காவிரி"],
  },
  {
    unit: "Unit IV", qNo: 9, marks: 2,
    questionEnglish: "Write a note about Muraipanai.",
    questionTamil: "முறை பாகை குறிப்பு எழுக.",
    answerEnglish: "Muraipanai (முறைப்பாகை) is the traditional rotational water-sharing system in ancient Tamil irrigation. Each farmer received water in their designated rotation turn from the shared tank or canal. This equitable system prevented conflicts and ensured fair irrigation access for all landholders.",
    answerTamil: "முறைப்பாகை என்பது பண்டைய தமிழ் பாசனத்தில் கடைப்பிடிக்கப்பட்ட பாரம்பரிய சுழல் நீர் பகிர்வு முறை. ஒவ்வொரு விவசாயியும் நிர்ணயிக்கப்பட்ட சுழல் முறையில் நீர் பெற்றனர். இந்த நியாயமான முறை தகராறுகளை தடுத்தது.",
    keywordsEnglish: ["Muraipanai", "rotational water sharing", "irrigation", "equitable"],
    keywordsTamil: ["முறைப்பாகை", "சுழல் நீர் பகிர்வு", "பாசனம்"],
  },
  {
    unit: "Unit IV", qNo: 10, marks: 2,
    questionEnglish: "Which water bodies are mentioned in Tamil literature?",
    questionTamil: "தமிழ் இலக்கியத்தில் குறிப்பிடும் நீர்நிலைகள் எவை?",
    answerEnglish: "Tamil literature mentions: (1) Eri (ஏரி) – tanks; (2) Kulam (குளம்) – ponds; (3) Vaav (வாவி) – large reservoirs; (4) Kaveri, Vaigai, Tamiraparani, Palar – major rivers; (5) Kadal (கடல்) – sea; (6) Keni (கேணி) – step wells. Each is associated with specific Sangam tinai landscapes.",
    answerTamil: "தமிழ் இலக்கியங்கள் குறிப்பிடும் நீர்நிலைகள்: (1) ஏரி – குளங்கள்; (2) குளம் – சிறிய தடாகங்கள்; (3) வாவி – பெரிய நீர்த்தேக்கங்கள்; (4) காவிரி, வைகை, தாமிரபரணி – நதிகள்; (5) கடல்; (6) கேணி – படிக்கட்டு கிணறுகள். ஒவ்வொன்றும் குறிப்பிட்ட திணையுடன் தொடர்புடையது.",
    keywordsEnglish: ["Eri", "Kulam", "Vaav", "Kaveri", "Keni", "Tinai"],
    keywordsTamil: ["ஏரி", "குளம்", "வாவி", "காவிரி", "கேணி", "திணை"],
  },
  {
    unit: "Unit IV", qNo: 11, marks: 2,
    questionEnglish: "Write a note about pastoral occupations.",
    questionTamil: "மேய்ச்சல் தொழில் பற்றிக்குறிப்பு எழுக.",
    answerEnglish: "Pastoral occupations in ancient Tamil society were associated with the Mullai (முல்லை) landscape. Communities like the Ayar (ஆயர்) herded cattle, sheep, and goats, producing milk, butter, and ghee. Sangam literature describes pastoral life, cattle raids (வெட்சி), and cattle fairs extensively.",
    answerTamil: "பண்டைய தமிழ் சமூகத்தில் மேய்ச்சல் தொழில்கள் முல்லை திணையுடன் தொடர்புடையவை. ஆயர் சமூகத்தினர் மாடு, ஆடு, செம்மறியாடு மேய்த்தனர்; பால், வெண்ணெய், நெய் உற்பத்தி செய்தனர். சங்க இலக்கியம் மேய்ச்சல் வாழ்க்கை மற்றும் வெட்சி திணையை விரிவாக விவரிக்கிறது.",
    keywordsEnglish: ["pastoral", "Mullai", "Ayar", "cattle", "Vetchi"],
    keywordsTamil: ["மேய்ச்சல்", "முல்லை", "ஆயர்", "கால்நடை", "வெட்சி"],
  },
  {
    unit: "Unit IV", qNo: 12, marks: 2,
    questionEnglish: "What were the water sources for cattle in ancient times?",
    questionTamil: "கால்நடைகளுக்கான நீர் நிலை எது?",
    answerEnglish: "Water sources for cattle in ancient Tamil Nadu: (1) Rivers and streams; (2) Natural ponds and tanks; (3) Wells dug in forests and grazing lands; (4) Seasonal marshes and waterholes. Sangam literature describes cattle grazing near rivers and forest water sources in the Mullai landscape.",
    answerTamil: "பண்டைய தமிழகத்தில் கால்நடைகளுக்கான நீர் ஆதாரங்கள்: (1) ஆறுகள் மற்றும் நீரோடைகள்; (2) இயற்கை குளங்கள் மற்றும் ஏரிகள்; (3) காடுகள், மேய்ச்சல் நிலங்களில் கிணறுகள்; (4) பருவகால சதுப்பு நிலங்கள். சங்க இலக்கியம் முல்லை திணையில் கால்நடைகள் மேய்வதை விவரிக்கிறது.",
    keywordsEnglish: ["cattle", "rivers", "ponds", "wells", "Mullai"],
    keywordsTamil: ["கால்நடை", "ஆறுகள்", "குளங்கள்", "கிணறுகள்", "முல்லை"],
  },
  {
    unit: "Unit IV", qNo: 13, marks: 2,
    questionEnglish: "Explain the concepts of Vanpulam and Menpulam.",
    questionTamil: "வன்புலம் மென்புலம் குறிப்பு எழுக.",
    answerEnglish: "Vanpulam (வன்புலம்) refers to dry, hard land suitable for dry farming (millets, pulses). Menpulam (மென்புலம்) refers to soft, fertile, wet land suitable for paddy cultivation. This land classification based on soil quality and water availability guided ancient Tamil crop selection and agricultural planning.",
    answerTamil: "வன்புலம் என்பது வறண்ட, கடினமான நிலம் – வறட்சி விவசாயத்திற்கு ஏற்றது (தினை, பயறு). மென்புலம் என்பது மென்மையான, வளமான, ஈரமான நிலம் – நெல் சாகுபடிக்கு ஏற்றது. இந்த நில வகைப்பாடு பண்டைய தமிழ் வேளாண்மை திட்டமிடலுக்கு அடிப்படையாக இருந்தது.",
    keywordsEnglish: ["Vanpulam", "Menpulam", "dry land", "fertile land", "agriculture"],
    keywordsTamil: ["வன்புலம்", "மென்புலம்", "வறண்ட நிலம்", "வளமான நிலம்"],
  },
  {
    unit: "Unit IV", qNo: 14, marks: 2,
    questionEnglish: "Name some sea birds mentioned in ancient texts.",
    questionTamil: "சங்க கால நூல்களில் குறிப்பிடப்படும் கடல் வாழ் பறவைகள் யாவை?",
    answerEnglish: "Sea birds in Sangam Tamil literature: (1) Kadalai (கடலை) – seagull; (2) Naarai (நாரை) – heron/crane; (3) Veli (வேலி) – water bird; (4) Aalvai (ஆல்வாய்) – coastal bird; (5) Kuruku (குருகு) – a type of crane. These are associated with the Neythal (coastal) tinai landscape.",
    answerTamil: "சங்க இலக்கியங்களில் கடல் வாழ் பறவைகள்: (1) கடலை – கடற்காக்கை; (2) நாரை – கொக்கு; (3) வேலி – நீர் பறவை; (4) ஆல்வாய் – கடலோர பறவை; (5) குருகு – ஒரு வகை கொக்கு. இவை சங்க கவிதையில் நெய்தல் திணையுடன் தொடர்புடையவை.",
    keywordsEnglish: ["Kadalai", "Naarai", "Kuruku", "Neythal", "coastal birds"],
    keywordsTamil: ["கடலை", "நாரை", "குருகு", "நெய்தல் திணை"],
  },
  {
    unit: "Unit IV", qNo: 15, marks: 2,
    questionEnglish: "Write a note about pearl diving.",
    questionTamil: "முத்துக்குளித்தல் குறிப்பு எழுக.",
    answerEnglish: "Pearl diving (முத்துக்குளித்தல்) was the traditional occupation of the Parathavar coastal community. The Gulf of Mannar was a renowned pearl fishing zone. Divers used a stone-weight rope to sink quickly, collected oysters (முத்துச்சிப்பி), and surfaced. Sangam literature mentions pearl trade as a significant economic activity.",
    answerTamil: "முத்துக்குளித்தல் பரதர் கடலோர சமூகத்தின் பாரம்பரிய தொழில். மன்னார் வளைகுடா பிரபல முத்து மீன்பிடி மண்டலம். கயிற்றில் கட்டிய கல் ஏந்தி விரைவாக மூழ்கி, முத்துச்சிப்பிகளை சேகரித்தனர். சங்க இலக்கியம் முத்து வணிகத்தை முக்கிய பொருளாதார செயல்பாடாக குறிப்பிடுகிறது.",
    keywordsEnglish: ["pearl diving", "Parathavar", "Gulf of Mannar", "oysters"],
    keywordsTamil: ["முத்துக்குளிப்பு", "பரதர்", "மன்னார் வளைகுடா", "முத்துச்சிப்பி"],
  },
  {
    unit: "Unit IV", qNo: 16, marks: 2,
    questionEnglish: "List four benefits of ponds (kulams).",
    questionTamil: "குளங்களின் நான்கு வன்மைகளை எழுதுக.",
    answerEnglish: "Four benefits of ponds (குளம்/ஏரி): (1) Irrigation supply – water for surrounding fields year-round; (2) Groundwater recharge – raises local water table; (3) Flood control – absorbs excess monsoon rainwater; (4) Drinking water and livestock – community water source for humans and animals.",
    answerTamil: "குளங்களின் நான்கு வன்மைகள்: (1) பாசன விநியோகம் – ஆண்டு முழுவதும் வயல்களுக்கு நீர்; (2) நிலத்தடி நீர் நிரப்பல் – உள்ளூர் நீர்மட்டத்தை உயர்த்தும்; (3) வெள்ள கட்டுப்பாடு – மழை நீரை உள்வாங்கும்; (4) குடிநீர் மற்றும் கால்நடை – சமூக நீர் ஆதாரம்.",
    keywordsEnglish: ["irrigation", "groundwater recharge", "flood control", "drinking water"],
    keywordsTamil: ["பாசனம்", "நிலத்தடி நீர்", "வெள்ள கட்டுப்பாடு", "குடிநீர்"],
  },
  {
    "unit": "Unit IV",
    "qNo": 17,
    "marks": 16,
    "questionEnglish": "Write in detail about water management and irrigation systems during the Sangam period.",
    "questionTamil": "சங்க காலத்து நீர் மேலாண்மை பற்றி விரிவாக எழுதவும்.",
    "answerEnglish": "Introduction:\nThe Sangam period (c. 300 BCE – 300 CE) witnessed a remarkably sophisticated system of water management and irrigation in ancient Tamil Nadu. Water was considered sacred (நீர் வளம்), and its management was central to governance, agriculture, and community life. Ancient Tamils developed an integrated system of tanks, canals, rivers, and community water-sharing mechanisms that sustained dense agricultural populations.\n\nI. Types of Water Bodies Used for Irrigation:\n\n1. Eri (ஏரி) – Tanks/Reservoirs:\n• Large-scale rain-fed storage bodies constructed across natural drainage paths\n• Each village typically had one or more eris\n• Managed by the village assembly (uur sabha) and elected water committees\n• Sangam texts mention kings and chieftains building eris as acts of benevolence\n• Example: Thiraiyan Eri – built by chieftain Thiraiyan for community benefit\n\n2. Kulam (குளம்) – Small Community Ponds:\n• Smaller water bodies; used for domestic, livestock, and small-scale irrigation needs\n• Often located within or near villages\n• Community-maintained through labor contributions\n\n3. Vaav (வாவி) – Large Reservoirs:\n• Larger than eris; some built by kings for regional irrigation\n• Mentioned in Sangam inscriptions\n\n4. Aaru (ஆறு) – Rivers:\n• Major rivers: Kaveri (காவிரி), Vaigai (வைகை), Tamirabarani (தாமிரபரணி), Palar (பாலாறு)\n• River water diverted through anaicuts (அணை) into canal networks\n• Kaveri Delta was the most productive agricultural zone due to river-based irrigation\n\n5. Keni (கேணி) – Step Wells:\n• Stepped wells allowing access to water at different depths\n• Used for drinking water and garden irrigation\n\nII. Key Infrastructure – The Grand Anicut (Kallanai):\n• Built by Chola king Karikalan across the Kaveri River (c. 2nd century CE)\n• Diverts Kaveri waters into the delta canal network\n• Still functional after 2,000+ years – one of the oldest water-regulating structures in the world\n• Made of rough-cut stone without mortar; relies on interlocking stone weight\n• Enabled the Kaveri delta to become the rice bowl of South India\n\nIII. Canal System (கால்வாய் அமைப்பு):\n• Canals (kaalvaai) carried water from rivers and tanks to fields\n• Primary canals (பெரும் கால்வாய்) from the main water source\n• Secondary canals (சிறு கால்வாய்) to individual fields\n• Sluice gates (மடை) at canal heads controlled water flow\n• Kumizhi Thoombu (குமிழித்தூம்பு) – water-lifting device used to raise water to elevated fields\n\nIV. Water Control Mechanisms:\n\nMadai (மடை) – Sluice Gates:\n• Openings in tank bunds and canal heads that control water release\n• Made of stone and wood; operated manually\n• Multiple madais in each tank bund for graded water release\n\nMuraipanai (முறைப்பாகை) – Rotational Water Sharing:\n• Equitable rotational system for distributing water among farmers\n• Each farmer received water in their designated turn\n• Prevented conflicts; ensured fair access regardless of field location\n• Documented in Sangam and early medieval inscriptions\n\nV. Water Management Officials:\n\nNeer Vettiyar (நீர் வெட்டியார்):\n• Water distributors who regulated flow from tanks into channels\n• Responsible for opening and closing sluices\n• Settled disputes between farmers competing for water\n\nNeeranikkararkal (நீரணிக்காரர்கள்):\n• Community water supervisors who monitored channel flow\n• Ensured each farmer received their allocated quota\n\nVI. Administrative Framework – Seven Committees (ஏழு வாரியங்கள்):\n• Chola king Parantaka I established seven administrative committees at the village level\n• One committee specifically managed tank and water affairs\n• Uttaramerur inscriptions (Kanchipuram) detail this democratic water governance system\n• Members elected by village assembly; held accountable for tank maintenance\n\nVII. Tank Maintenance (ஏரி பராமரிப்பு):\n• Annual desilting of tanks before monsoon season\n• Community labor (kudimaramath – குடிமராமத்) – collective maintenance work\n• Bund repairs after each monsoon\n• Clearing of canal channels of weeds and silt\n\nVIII. Relationship between Water Management and Agriculture:\n• Kaveri Delta (marudam landscape) – intensive paddy cultivation fed by canals\n• Tank-fed agriculture for millets (thinai, kambu) in drier regions\n• Two paddy crops possible where canal irrigation was reliable\n• Sangam literature distinguishes between vanpulam (dry land) and menpulam (wet land) based on water availability\n\nIX. Literary Evidence:\n• Pattinappalai describes Kaveri flowing through fertile delta lands\n• Purananuru praises kings who built tanks and canals as protectors of their people\n• Akananuru describes water flowing through channels to reach fields\n• Tolkappiyam's tinai system associates water management with the Marudam landscape\n\nConclusion:\nThe Sangam-period water management system was a remarkable achievement of community engineering and governance. The integration of tank construction, canal networks, rotational sharing systems, and dedicated officials created a sustainable agricultural civilization in ancient Tamil Nadu. Many of these systems — particularly the Kallanai and the tank-based irrigation network — remained functional for nearly two millennia, a testament to their exceptional design and community commitment.\n\nKeywords: Eri, Kallanai, Madai, Muraipanai, Neer Vettiyar, Kaveri, canal, tank, Sangam, kudimaramath",
    "answerTamil": "அறிமுகம்:\nசங்க காலம் (கி.மு. 300 – கி.பி. 300) பண்டைய தமிழகத்தில் மிகவும் நுட்பமான நீர் மேலாண்மை மற்றும் பாசன முறைகளை கொண்டிருந்தது. நீரை புனிதமாக கருதிய பண்டைய தமிழர்கள், அதன் மேலாண்மையை ஆட்சி, வேளாண்மை மற்றும் சமூக வாழ்க்கையின் மையமாக வைத்தனர்.\n\nI. பாசனத்திற்கு பயன்படுத்தப்பட்ட நீர்நிலைகள்:\n\n1. ஏரி (Tank/Reservoir):\n• இயற்கையான வடிகால் பாதைகளில் கட்டப்பட்ட மழை நீர் சேமிப்பு நீர்நிலைகள்\n• ஒவ்வொரு கிராமத்திலும் ஒன்று அல்லது அதிகமான ஏரிகள் இருந்தன\n• கிராம சபை மற்றும் தேர்ந்தெடுக்கப்பட்ட நீர்க்குழுக்களால் நிர்வகிக்கப்பட்டன\n• திரையன் ஏரி – தலைவன் திரையனால் சமூக நலனுக்காக கட்டப்பட்ட எடுத்துக்காட்டு\n\n2. குளம் – சிறிய சமூக தடாகங்கள்:\n• வீட்டு, கால்நடை மற்றும் சிறுவிவசாயத் தேவைகளுக்கு பயன்படும்\n• சமூக உழைப்பு பங்களிப்பால் பராமரிக்கப்பட்டன\n\n3. வாவி – பெரிய நீர்த்தேக்கங்கள்:\n• ஏரியை விட பெரியவை; சில அரசர்களால் பிராந்திய பாசனத்திற்கு கட்டப்பட்டன\n\n4. ஆறு – நதிகள்:\n• முக்கிய நதிகள்: காவிரி, வைகை, தாமிரபரணி, பாலாறு\n• அணைகள் மூலம் நீர் கால்வாய் வலையமைப்பிற்கு திருப்பிவிடப்பட்டது\n\n5. கேணி – படிக்கட்டு கிணறுகள்:\n• குடிநீர் மற்றும் தோட்ட பாசனத்திற்கு பயன்படும்\n\nII. முக்கிய கட்டமைப்பு – கல்லணை:\n• காவிரி நதியில் சோழ அரசன் கரிகாலனால் கட்டப்பட்டது (கி.பி. 2ஆம் நூற்றாண்டு)\n• காவிரி நீரை டெல்டா கால்வாய் வலையமைப்பிற்கு திருப்பிவிடுகிறது\n• 2000+ ஆண்டுகளுக்கு மேலாக இன்னும் செயல்படுகிறது\n• சாந்து இல்லாமல் வெட்டப்பட்ட கற்களால் ஆனது\n\nIII. கால்வாய் அமைப்பு:\n• பிரதான கால்வாய்கள் முக்கிய நீர் ஆதாரத்திலிருந்து\n• சிறு கால்வாய்கள் தனிப்பட்ட வயல்களுக்கு\n• மடைகள் கால்வாய் தலைகளில் நீர் ஓட்டத்தை கட்டுப்படுத்தின\n• குமிழித்தூம்பு – உயர்ந்த வயல்களுக்கு நீர் உயர்த்தும் கருவி\n\nIV. நீர் கட்டுப்பாட்டு வழிமுறைகள்:\n\nமடை – தூம்பு வாயில்:\n• குளம் மற்றும் கால்வாய் தலைகளில் நீர் வெளியீட்டை கட்டுப்படுத்தும் திறப்புகள்\n\nமுறைப்பாகை – சுழல் நீர் பங்கீடு:\n• விவசாயிகளுக்கிடையே நீரை நியாயமாக பகிர்வதற்கான சுழல் முறை\n• ஒவ்வொரு விவசாயியும் நிர்ணயிக்கப்பட்ட முறையில் நீர் பெற்றனர்\n• தகராறுகளை தடுத்து நியாயமான அணுகலை உறுதி செய்தது\n\nV. நீர் மேலாண்மை அதிகாரிகள்:\n• நீர் வெட்டியார் – குளங்களிலிருந்து கால்வாய்களுக்கு நீர் ஓட்டத்தை சீராக்கிய நீர் விநியோகிகள்\n• நீரணிக்காரர்கள் – கால்வாய் ஓட்டத்தை கண்காணித்த சமூக நீர் கண்காணிப்பாளர்கள்\n\nVI. நிர்வாக கட்டமைப்பு – ஏழு வாரியங்கள்:\n• சோழ அரசன் பராந்தக I கிராம மட்டத்தில் ஏழு நிர்வாக குழுக்களை நிறுவினார்\n• ஒரு குழு குளம் மற்றும் நீர் விவகாரங்களை நிர்வகித்தது\n• உத்தரமேரூர் கல்வெட்டுகள் இந்த ஜனநாயக நீர் நிர்வாக முறையை விவரிக்கின்றன\n\nVII. குளம் பராமரிப்பு:\n• பருவமழைக்கு முன் குளங்களை வருடாந்திர சேறு எடுத்தல்\n• குடிமராமத் – கூட்டுப் பராமரிப்பு வேலை\n• ஒவ்வொரு பருவமழைக்கும் பின் கரை பழுதுபார்ப்பு\n\nVIII. நீர் மேலாண்மையும் வேளாண்மையும்:\n• காவிரி டெல்டா – கால்வாய்களால் நீரூட்டப்பட்ட தீவிர நெல் சாகுபடி\n• தொட்டிகள் பாசனத்தால் வறண்ட பகுதிகளில் தினை, கம்பு\n• நீர்ப்பாசனம் நம்பகமான இடங்களில் இரண்டு நெல் பயிர்கள் சாத்தியம்\n• வன்புலம் (வறண்ட நிலம்) மற்றும் மென்புலம் (ஈரமான நிலம்) வேறுபாடு\n\nமுடிவுரை:\nசங்க கால நீர் மேலாண்மை முறை சமூக பொறியியல் மற்றும் நிர்வாகத்தின் குறிப்பிடத்தக்க சாதனையாகும். குளம் கட்டுமானம், கால்வாய் வலையமைப்பு, சுழல் பகிர்வு முறைகள் மற்றும் அர்ப்பணிக்கப்பட்ட அதிகாரிகளின் ஒருங்கிணைப்பு பண்டைய தமிழகத்தில் நிலையான வேளாண் நாகரிகத்தை உருவாக்கியது.\n\nமுக்கிய சொற்கள்: ஏரி, கல்லணை, மடை, முறைப்பாகை, நீர் வெட்டியார், காவிரி, கால்வாய், குளம், குடிமராமத்",
    "keywordsEnglish": ["Eri", "Kallanai", "Madai", "Muraipanai", "Neer Vettiyar", "Kaveri", "canal", "tank", "Sangam", "kudimaramath"],
    "keywordsTamil": ["ஏரி", "கல்லணை", "மடை", "முறைப்பாகை", "நீர் வெட்டியார்", "காவிரி", "கால்வாய்", "குளம்", "குடிமராமத்"]
  },
  {
    "unit": "Unit IV",
    "qNo": 18,
    "marks": 16,
    "questionEnglish": "Explain in detail about the Kallanai dam (Grand Anicut) – its construction, purpose and historical significance.",
    "questionTamil": "கல்லணை - அதன் கட்டுமானம், நோக்கம் மற்றும் வரலாற்று முக்கியத்துவம் பற்றி விரிவாக விளக்குக.",
    "answerEnglish": "Introduction:\nKallanai (கல்லணை), known in English as the Grand Anicut, is one of the oldest surviving water-regulating structures in the world. Built across the mighty Kaveri River in what is now Thanjavur district of Tamil Nadu, it has been in continuous use for approximately 2,000 years. It stands as a supreme example of ancient Tamil hydraulic engineering and represents the genius of Sangam-period water management.\n\nI. Historical Background:\n• Constructed by the great Chola king Karikalan (கரிகால சோழன்), around the 2nd century CE\n• Karikalan is celebrated in Sangam literature (Purananuru, Pattinappalai) as a conqueror and builder\n• The name 'Kallanai' means 'stone dam' in Tamil (கல் = stone; அணை = dam)\n• Also called the Grand Anicut by British engineers who recognized its extraordinary engineering\n• It is designated as a National Monument under the Archaeological Survey of India (ASI)\n\nII. Location:\n• Built across the Kaveri River near Tiruchirapalli (Trichy), Tamil Nadu\n• At the point where the Kaveri divides into its delta distributaries: Kollidam (Coleroon) and the main Kaveri channel\n• GPS coordinates: approximately 10.847°N, 78.826°E\n• The structure spans approximately 329 metres (1,080 feet) across the river\n\nIII. Construction Method and Materials:\n\nMaterials:\n• Built from rough-cut granite boulders — no mortar, no cement\n• Stones interlocked by their own weight and natural fit\n• Later, British engineers in the 19th century added lime mortar pointing for reinforcement\n\nConstruction Technique:\n• The anicut (check dam) was built perpendicular across the river\n• Height: approximately 5.4 metres (18 feet) above riverbed\n• Width at base: approximately 20 metres\n• A series of gradually stepped stone courses on the downstream face dissipated water energy\n• The structure was not meant to completely stop river flow but to divert it\n\nBritish Colonial Improvements:\n• Sir Arthur Cotton (British engineer) studied and restored the anicut in 1838–1839\n• He expressed admiration for the ancient engineers' skill, noting it had functioned successfully for nearly 2,000 years\n• Cotton improved it with lime mortar and added modern sluices\n• He modelled his delta irrigation works in the Godavari and Krishna rivers on this ancient Tamil design\n\nIV. Engineering Principle – How It Works:\n• The anicut acts as a diversion weir — it raises the water level of the river on the upstream side\n• The raised water level allows water to flow by gravity into canals on both sides of the river\n• The anicut does not completely block the river; excess water flows over the top\n• The Kollidam (northern branch) is partially regulated by the anicut to ensure the southern Kaveri receives adequate water\n• Multiple canals (kaalvaais) branching from the anicut feed the Kaveri Delta: Grand Anicut Canal, Vennar Canal, Old Cauvery, etc.\n\nV. Purpose and Functions:\n\n1. Flood Control:\n• Regulates monsoon flood waters in the Kaveri\n• Prevents uncontrolled flooding of delta agricultural lands\n• The gradual overflow design allows safe flood passage\n\n2. Irrigation Supply:\n• Feeds the Kaveri Delta – one of the most productive agricultural zones in South Asia\n• Irrigates approximately 69,000 hectares of agricultural land even today\n• Enabled cultivation of paddy (rice), sugarcane, bananas, and other crops year-round\n\n3. Water Distribution:\n• Divides Kaveri waters equitably between the northern (Kollidam) and southern (Kaveri) channels\n• Maintains navigability of the main Kaveri channel\n\n4. Groundwater Recharge:\n• Raised upstream water levels allow percolation, recharging local wells and aquifers\n\nVI. Historical Significance:\n\n1. Oldest Functioning Dam:\n• Approximately 2,000 years old and still functional — extraordinary engineering achievement\n• Predates most famous dams in the world; older than the Roman dam of Cornalvo (Spain)\n\n2. Agricultural Revolution:\n• Made the Kaveri Delta the 'rice bowl' of South India\n• Sustained dense populations in the Chola heartland through reliable irrigation\n• Contributed directly to the political and economic power of the Chola dynasty\n\n3. Engineering Legacy:\n• Sir Arthur Cotton used it as a model for irrigating the Godavari and Krishna deltas — transforming agriculture in coastal Andhra\n• The Kallanai's design influenced modern check dam engineering\n• Demonstrates that ancient Tamils understood hydraulics, river dynamics, and stone mechanics without modern engineering tools\n\n4. Cultural Significance:\n• Associated with the heroic Chola king Karikalan who is celebrated in Sangam literature\n• Became a symbol of Tamil engineering genius and royal benevolence\n• Sangam texts (Purananuru 66) describe Karikalan's feat of containing the Kaveri floods\n\n5. UNESCO Recognition:\n• Recognized as part of Tamil Nadu's heritage; protected as a National Monument\n• Included in discussions of ancient engineering marvels\n\nVII. Modern Relevance:\n• The Kallanai still functions as part of the Kaveri Delta irrigation system\n• Modern sluice gates (added by British and post-Independence engineers) complement the ancient structure\n• Managed by the Tamil Nadu Public Works Department (PWD)\n• Local people still worship the Kallanai as a sacred heritage site\n• Annual sluice opening ceremonies mark the beginning of the cultivation season\n\nConclusion:\nThe Kallanai is far more than a dam — it is a living monument to the extraordinary hydraulic intelligence of ancient Tamils. Built without modern machinery or engineering instruments, guided purely by observation, experience, and community labor, it has sustained agricultural civilization in the Kaveri Delta for two millennia. Its enduring functionality after 2,000 years makes it one of the greatest civil engineering achievements in human history.\n\nKeywords: Kallanai, Grand Anicut, Karikalan, Chola, Kaveri, diversion weir, granite, Arthur Cotton, irrigation, delta, 2000 years, National Monument",
    "answerTamil": "அறிமுகம்:\nகல்லணை, ஆங்கிலத்தில் கிராண்ட் ஆனிகட் என்று அழைக்கப்படும், உலகின் மிகவும் பழமையான நீர் கட்டுப்பாட்டு கட்டமைப்புகளில் ஒன்றாகும். தமிழ்நாட்டின் தஞ்சாவூர் மாவட்டத்தில் (தற்போது திருச்சிராப்பள்ளி அருகே) காவிரி நதியில் கட்டப்பட்டது. சுமார் 2,000 ஆண்டுகளாக தொடர்ச்சியாக பயன்படுத்தப்படுகிறது.\n\nI. வரலாற்றுப் பின்னணி:\n• கி.பி. 2ஆம் நூற்றாண்டில் மாபெரும் சோழ அரசன் கரிகால சோழனால் கட்டப்பட்டது\n• கரிகாலன் புறநானூறு மற்றும் பட்டினப்பாலையில் போர்வீரராகவும் கட்டுமானகாரராகவும் போற்றப்படுகிறார்\n• 'கல்லணை' என்பது 'கற்கட்டணை' என்று பொருள் (கல் = கல்; அணை = தடை)\n• 'கிராண்ட் ஆனிகட்' என்று பிரிட்டிஷ் பொறியாளர்கள் அழைத்தனர்\n• இந்திய தொல்லியல் கழகத்தின் (ASI) கீழ் தேசிய நினைவுச்சின்னமாக அறிவிக்கப்பட்டுள்ளது\n\nII. அமைவிடம்:\n• காவிரி நதியில் திருச்சிராப்பள்ளி அருகே கட்டப்பட்டது\n• காவிரி தன் டெல்டா கிளைகளாக பிரியும் இடத்தில்: கொள்ளிடம் மற்றும் முக்கிய காவிரி கிளை\n• நதியில் சுமார் 329 மீட்டர் (1,080 அடி) நீளம் கொண்டது\n\nIII. கட்டுமான முறை மற்றும் பொருட்கள்:\n\nபொருட்கள்:\n• வெட்டப்பட்ட கரடுமுரடான கரடிக்கற்கள் – சாந்து அல்லது சிமெண்ட் இல்லாமல்\n• கற்கள் தங்கள் சொந்த எடையால் ஒன்றுடன் ஒன்று பிணைக்கப்பட்டவை\n• பிரிட்டிஷ் பொறியாளர்கள் 19ஆம் நூற்றாண்டில் சுண்ணாம்பு சாந்து சேர்த்தனர்\n\nகட்டுமான நுட்பம்:\n• நதிக்கு குறுக்கே அணை கட்டப்பட்டது\n• உயரம்: ஆற்றுப்படுகையிலிருந்து சுமார் 5.4 மீட்டர்\n• கட்டமைப்பு நீரை முழுமையாக தடுக்காது; திருப்பி விடுகிறது\n\nபிரிட்டிஷ் மேம்பாடுகள்:\n• சர் ஆர்தர் காட்டன் 1838–39 இல் ஆய்வு செய்து மீட்டார்\n• கிட்டத்தட்ட 2,000 ஆண்டுகள் வெற்றிகரமாக செயல்பட்டதை போற்றினார்\n• கோதாவரி மற்றும் கிருஷ்ணா டெல்டாக்களில் இந்த பண்டைய வடிவமைப்பை மாதிரியாக பயன்படுத்தினார்\n\nIV. பொறியியல் கோட்பாடு:\n• அணை மேல்திசை நீர்மட்டத்தை உயர்த்துகிறது\n• உயர்ந்த நீர்மட்டம் இரு புறங்களிலும் கால்வாய்களுக்கு ஈர்ப்பு விசையால் நீர் பாய அனுமதிக்கிறது\n• அதிகப்படியான நீர் மேல் பகுதியிலிருந்து ஓடுகிறது\n\nV. நோக்கம் மற்றும் செயல்பாடுகள்:\n\n1. வெள்ள கட்டுப்பாடு:\n• காவிரியின் பருவமழை வெள்ளத்தை கட்டுப்படுத்துகிறது\n• டெல்டா வேளாண்மை நிலங்களை கட்டுப்பாடற்ற வெள்ளத்திலிருந்து தடுக்கிறது\n\n2. பாசன விநியோகம்:\n• காவிரி டெல்டாவை உணவூட்டுகிறது\n• இன்றும் சுமார் 69,000 ஹெக்டேர் வேளாண்மை நிலத்திற்கு பாசனம் செய்கிறது\n• நெல், கரும்பு, வாழை மற்றும் பிற பயிர்கள் ஆண்டு முழுவதும் சாகுபடி\n\n3. நீர் விநியோகம்:\n• வடக்கு (கொள்ளிடம்) மற்றும் தெற்கு (காவிரி) கிளைகளுக்கு காவிரி நீரை சமமாக பிரிக்கிறது\n\nVI. வரலாற்று முக்கியத்துவம்:\n\n1. மிகவும் பழமையான செயல்பாட்டில் உள்ள அணை:\n• சுமார் 2,000 ஆண்டுகள் பழமை – தவிர்க்க முடியாத பொறியியல் சாதனை\n• உலகின் பெரும்பாலான பிரபல அணைகளை விட பழமையானது\n\n2. வேளாண் புரட்சி:\n• காவிரி டெல்டாவை தென்னிந்தியாவின் 'அரிசி கூடை' ஆக்கியது\n• நம்பகமான பாசனம் மூலம் சோழர் நாட்டில் அடர்ந்த மக்கள்தொகையை நிலைத்திருக்க வைத்தது\n\n3. பொறியியல் பாரம்பரியம்:\n• சர் ஆர்தர் காட்டன் இந்த வடிவமைப்பை மாதிரியாக கோதாவரி மற்றும் கிருஷ்ணா டெல்டாக்களை நீர்ப்பாசனம் செய்தார்\n• நவீன சோதிக்குழி அணை பொறியியலை பாதித்தது\n\n4. கலாச்சார முக்கியத்துவம்:\n• காவிரி வெள்ளத்தை கட்டுப்படுத்திய வீரர் கரிகாலனுடன் தொடர்புடையது\n• சங்க நூல்கள் (புறநானூறு 66) கரிகாலனின் சாதனையை விவரிக்கின்றன\n\nVII. நவீன தொடர்பு:\n• கல்லணை இன்னும் காவிரி டெல்டா பாசன அமைப்பின் ஒரு பகுதியாக செயல்படுகிறது\n• தமிழ்நாடு பொது வேலைகள் துறையால் நிர்வகிக்கப்படுகிறது\n• உள்ளூர் மக்கள் இன்னும் பாரம்பரிய கலாச்சார நினைவிடமாக வணங்குகிறார்கள்\n\nமுடிவுரை:\nகல்லணை வெறும் அணை மட்டுமல்ல — இது பண்டைய தமிழரின் தலைசிறந்த நீர் பொறியியல் திறனுக்கு ஒரு உயிரோட்டமான நினைவுச்சின்னம். நவீன இயந்திரங்கள் அல்லது பொறியியல் கருவிகள் இல்லாமல் கட்டப்பட்டது, இரண்டு ஆயிரம் ஆண்டுகளாக காவிரி டெல்டாவில் வேளாண் நாகரிகத்தை நிலைத்திருக்க வைத்தது.\n\nமுக்கிய சொற்கள்: கல்லணை, கரிகாலன், சோழர், காவிரி, திருப்பு அணை, கரடிக்கல், ஆர்தர் காட்டன், பாசனம், டெல்டா, 2000 ஆண்டுகள்",
    "keywordsEnglish": ["Kallanai", "Grand Anicut", "Karikalan", "Chola", "Kaveri", "diversion weir", "granite", "Arthur Cotton", "irrigation", "delta", "2000 years"],
    "keywordsTamil": ["கல்லணை", "கரிகாலன்", "சோழர்", "காவிரி", "திருப்பு அணை", "கரடிக்கல்", "ஆர்தர் காட்டன்", "பாசனம்", "டெல்டா"]
  },
  {
    "unit": "Unit IV",
    "qNo": 19,
    "marks": 16,
    "questionEnglish": "Describe the agricultural practices of ancient Tamils during the Sangam period.",
    "questionTamil": "சங்க காலத்தில் தமிழர்களின் விவசாயம் பற்றி எழுதவும்.",
    "answerEnglish": "Introduction:\nAgriculture was the backbone of Sangam-period (c. 300 BCE – 300 CE) Tamil economy and civilization. The ancient Tamils developed sophisticated farming techniques suited to different ecological zones, classified in Sangam literature through the Tinai (திணை) landscape system. Their agricultural knowledge encompassed soil classification, crop selection, water management, tools, and seasonal planning.\n\nI. The Tinai System and Agriculture:\nSangam literature classifies the Tamil land into five ecological zones (Tinai), each with characteristic agricultural practices:\n\n1. Kurinji (குறிஞ்சி) – Hilly Terrain:\n• Slash-and-burn cultivation (புனம் தொழில் – punam tozhil)\n• Crops: millet (தினை – thinai), finger millet, and forest produce\n• Farming community: Kuravar (குறவர்)\n• Terraced cultivation on hill slopes\n• Guard huts (pullu) erected to protect crops from birds and animals\n\n2. Mullai (முல்லை) – Forest and Pastoral:\n• Pastoral farming dominant; cattle herding\n• Some cultivation of cereals and millets\n• Community: Ayar (ஆயர் – cowherds)\n• Semi-nomadic grazing; cattle were the primary wealth\n\n3. Marudam (மருதம்) – Fertile River Valleys:\n• Most intensive and productive agriculture\n• Wet rice cultivation (நெல் சாகுபடி) using canal irrigation\n• Crops: paddy (நெல்), sugarcane (கரும்பு), plantain (வாழை)\n• Community: Uzhavar (உழவர் – ploughmen)\n• Use of ploughs, sickles, and irrigation channels\n\n4. Neythal (நெய்தல்) – Coastal Zone:\n• Fishing dominant; some salt production and rice cultivation in backwaters\n• Community: Parathavar (பரதர்)\n• Coastal paddy fields near lagoons\n\n5. Palai (பாலை) – Arid/Wasteland:\n• Not suitable for agriculture; hunter-gatherer lifestyle\n• Community: Maravars (மறவர்)\n\nII. Main Crops Cultivated:\n\n1. Paddy/Rice (நெல்):\n• Most prestigious crop; associated with Marudam landscape\n• Multiple varieties grown in Kaveri Delta\n• Terms in Sangam literature: nelveli (நெல்வேலி), nelkadai\n• Harvested twice a year in well-irrigated delta regions\n\n2. Millets (தினைகள்):\n• Thinai (foxtail millet) – grown in hills and dry lands\n• Kambu (pearl millet – கம்பு)\n• Varagu (kodo millet)\n• Cholam (sorghum – சோளம்)\n• Drought-resistant; required less water\n\n3. Sugarcane (கரும்பு):\n• Grown in river valleys with ample water\n• Pattinappalai mentions sugarcane fields near Puhar\n\n4. Vegetables and Fruits:\n• Plantain (வாழை), jackfruit, mango\n• Various gourds, tubers, and leafy vegetables\n\n5. Pulses and Oilseeds:\n• Sesame (எள்), mustard (கடுகு)\n• Various beans and lentils\n\nIII. Agricultural Tools:\n\n1. Kalar (கலர்) / Plough (ஏர்):\n• Wooden plough with iron tip (கொழு)\n• Drawn by two bullocks\n• Used for primary tillage of field\n\n2. Sickle (அரிவாள் – arival):\n• Iron sickle for harvesting crops\n• One of the most common iron implements found at excavations\n\n3. Spade (மண் வெட்டி):\n• For digging irrigation channels and turning soil\n\n4. Threshing implement:\n• Bullocks used for threshing; grain beaten on threshing floors\n\n5. Winnowing basket (மuram – முறம்):\n• Flat basket for separating grain from chaff\n\nIV. Water Management in Agriculture:\n• Tank-fed irrigation (eri-based) for dry zone cultivation\n• River-fed canal irrigation for delta paddy\n• Muraipanai (rotational water sharing) for fair distribution\n• Well irrigation (கிணற்று பாசனம்) for garden crops\n• Kumizhi Thoombu for lifting water to elevated fields\n\nV. Seasonal Calendar (Seasonal Farming):\n• Tamil agricultural calendar was tied to the six-season Tamil year\n• Kaar (monsoon – ஆடி-ஆவணி) – planting paddy seedlings\n• Koothir (early winter – ஐப்பasi-கார்த்திகை) – main paddy harvest\n• Munpani (dewy season) – second crop and garden cultivation\n• Farmers closely observed stars (Rohini, Krittika) for planting timings\n\nVI. Livestock in Agriculture:\n• Bullocks (ஏர் மாடு) – for ploughing and threshing\n• Cows – for milk and manure\n• Buffaloes – for ploughing in wet paddy fields\n• Sangam literature (Akananuru, Purananuru) celebrates cattle as primary agricultural wealth\n• Cattle raids (வெட்சி tiṇai) were a common cause of conflict between neighboring communities\n\nVII. Granaries and Storage:\n• Grain stored in large earthen pots (கலயம்) and thatched granaries (களஞ்சியம்)\n• Kings maintained public granaries for times of famine\n• Purananuru describes generous kings distributing grain to the poor\n\nVIII. Land Classification:\n• Vanpulam (வன்புலம்) – dry hard land for dry farming (millets, pulses)\n• Menpulam (மென்புலம்) – soft fertile land for wet cultivation (paddy)\n• Idam (இடம்) – garden land near habitation\n• Proper land classification guided crop selection and water allocation\n\nIX. Literary Evidence:\n• Purananuru describes kings rewarding farmers and protecting agricultural lands\n• Pattinappalai describes the bustling market at Puhar selling agricultural produce\n• Akananuru and Natrinai describe pastoral and agricultural landscapes in vivid detail\n• Mullaikppattu gives the most detailed description of pastoral life and seasonal farming\n• Tolkappiyam categorizes agriculture within the tinai framework\n\nX. Royal Support for Agriculture:\n• Kings built tanks, canals, and anaicuts as royal duties\n• Land grants (innam) to farmers and temples supported agricultural expansion\n• Tax (karai) collected as a share of produce; fair rulers charged 1/6th\n• Protecting farmland from raids was a primary royal responsibility\n\nConclusion:\nSangam-period Tamil agriculture was sophisticated, ecologically adaptive, and community-managed. The integration of tinai-based landscape knowledge, diversified cropping systems, iron tools, irrigation infrastructure, and community water-sharing made ancient Tamil agriculture one of the most productive in the ancient world. The agricultural wealth it generated sustained the thriving urban centers, maritime trade, and temple culture of classical Tamil civilization.\n\nKeywords: Tinai, Marudam, paddy, millet, plough, Uzhavar, Ayar, irrigation, Muraipanai, Kurinji, sugarcane, cattle",
    "answerTamil": "அறிமுகம்:\nவேளாண்மை சங்க காலத்தில் (கி.மு. 300 – கி.பி. 300) தமிழ் பொருளாதாரம் மற்றும் நாகரிகத்தின் முதுகெலும்பாக இருந்தது. பண்டைய தமிழர்கள் வெவ்வேறு சூழல் மண்டலங்களுக்கு ஏற்ற நுட்பமான விவசாய தொழில்நுட்பங்களை உருவாக்கினர். சங்க இலக்கியத்தில் திணை (景) நிலவமைப்பு முறை மூலம் வகைப்படுத்தப்பட்டது.\n\nI. திணை முறையும் வேளாண்மையும்:\n\n1. குறிஞ்சி – மலை நிலம்:\n• புனம் தொழில் (வெட்டு-எரி சாகுபடி)\n• பயிர்கள்: தினை, விரலி கம்பு, காட்டு விளைவுகள்\n• சமூகம்: குறவர்\n\n2. முல்லை – காடு மற்றும் மேய்ச்சல் நிலம்:\n• மேய்ச்சல் விவசாயம் ஆதிக்கம்; கால்நடை மேய்ப்பு\n• சமூகம்: ஆயர் (இடையர்)\n\n3. மருதம் – வளமான நதி பள்ளத்தாக்குகள்:\n• மிகவும் தீவிரமான மற்றும் உற்பத்தி திறன் மிக்க வேளாண்மை\n• கால்வாய் பாசனம் பயன்படுத்திய ஈர நெல் சாகுபடி\n• பயிர்கள்: நெல், கரும்பு, வாழை\n• சமூகம்: உழவர்\n\n4. நெய்தல் – கடலோர மண்டலம்:\n• மீன்பிடி ஆதிக்கம்; சில உப்பு உற்பத்தி மற்றும் நெல் சாகுபடி\n• சமூகம்: பரதர்\n\n5. பாலை – வறண்ட நிலம்:\n• வேளாண்மைக்கு ஏற்றதல்ல; வேட்டை வாழ்க்கை\n\nII. முக்கிய பயிர்கள்:\n\n1. நெல்:\n• மிகவும் மதிப்பான பயிர்; மருதம் திணையுடன் தொடர்புடையது\n• காவிரி டெல்டாவில் பல வகைகள்\n• நீர்ப்பாசன வசதியுள்ள இடங்களில் ஆண்டிற்கு இரு பயிர்கள்\n\n2. தினைகள்:\n• தினை (foxttail millet), கம்பு, வரகு, சோளம்\n• வறட்சி எதிர்ப்பு; குறைவான நீர் தேவை\n\n3. கரும்பு:\n• நதி பள்ளத்தாக்குகளில் ஏராளமான நீருடன் வளர்க்கப்பட்டது\n\n4. காய்கறிகள் மற்றும் பழங்கள்:\n• வாழை, பலா, மாம்பழம்\n• பல்வேறு கீரைகள் மற்றும் கிழங்குகள்\n\nIII. வேளாண்மை கருவிகள்:\n• ஏர் (கலர்/உழவு) – இரும்பு நுனியுடன் மரக் கலர்\n• அரிவாள் – பயிர் அறுப்பதற்கான இரும்பு கத்தி\n• மண் வெட்டி – பாசன கால்வாய் தோண்டவும் மண் திருப்பவும்\n• முறம் – தானியத்திலிருந்து உமியை பிரிக்கும் தட்டை கூடை\n\nIV. வேளாண்மையில் நீர் மேலாண்மை:\n• ஏரி அடிப்படையிலான பாசனம் வறண்ட மண்டல சாகுபடிக்கு\n• நதி அடிப்படையிலான கால்வாய் பாசனம் டெல்டா நெல்லுக்கு\n• முறைப்பாகை – நியாயமான விநியோகத்திற்கு சுழல் நீர் பகிர்வு\n\nV. பருவகால அட்டவணை:\n• தமிழ் வேளாண்மை அட்டவணை ஆறு பருவகால தமிழ் ஆண்டுடன் தொடர்புடையது\n• கார் (பருவமழை) – நெல் நாற்று நடவு\n• கூதிர் (ஆரம்ப குளிர்காலம்) – முக்கிய நெல் அறுவடை\n\nVI. வேளாண்மையில் கால்நடை:\n• ஏர் மாடு – உழவுக்கும் கறிக்கும்\n• பசுக்கள் – பால் மற்றும் எரு\n• கருமை – ஈர நெல் வயல்களில் உழவுக்கு\n• வெட்சி – கால்நடை கொள்ளை அண்டை சமூகங்களிடையே பொதுவான மோதலுக்கு காரணமாக இருந்தது\n\nVII. நில வகைப்பாடு:\n• வன்புலம் – வறண்ட கடின நிலம் (தினை, பயறு)\n• மென்புலம் – மென்மையான வளமான நிலம் (நெல்)\n\nVIII. இலக்கிய சான்றுகள்:\n• புறநானூறு விவசாய நிலங்களை பாதுகாக்கும் அரசர்களை விவரிக்கிறது\n• பட்டினப்பாலை புகாரில் வேளாண்மை விளைவுகளை விற்கும் கடைத்தெருவை விவரிக்கிறது\n• மூல்லைப்பாட்டு மேய்ச்சல் வாழ்க்கை மற்றும் பருவகால விவசாயத்தை விரிவாக விவரிக்கிறது\n\nIX. வேளாண்மைக்கு அரசு ஆதரவு:\n• அரசர்கள் அரசகடமையாக குளங்கள், கால்வாய்கள் கட்டினார்கள்\n• விளைவுகளின் பங்காக வரி (கரை) வசூலிக்கப்பட்டது; நியாயமான அரசர்கள் 1/6 வசூலித்தனர்\n\nமுடிவுரை:\nசங்க கால தமிழ் வேளாண்மை நுட்பமான, சூழலியல் அடிப்படையிலான மற்றும் சமூக நிர்வாகம் கொண்டதாக இருந்தது. திணை அடிப்படையிலான நிலவமைப்பு அறிவு, பன்முக பயிர் முறைகள், இரும்பு கருவிகள் மற்றும் பாசன கட்டமைப்பின் ஒருங்கிணைப்பு பண்டைய தமிழ் வேளாண்மையை பண்டைய உலகில் மிகவும் உற்பத்தி திறன் மிக்கவற்றில் ஒன்றாக ஆக்கியது.\n\nமுக்கிய சொற்கள்: திணை, மருதம், நெல், தினை, ஏர், உழவர், ஆயர், பாசனம், முறைப்பாகை, கரும்பு",
    "keywordsEnglish": ["Tinai", "Marudam", "paddy", "millet", "plough", "Uzhavar", "Ayar", "irrigation", "Muraipanai", "Kurinji", "sugarcane", "cattle"],
    "keywordsTamil": ["திணை", "மருதம்", "நெல்", "தினை", "ஏர்", "உழவர்", "ஆயர்", "பாசனம்", "முறைப்பாகை", "கரும்பு", "கால்நடை"]
  },
  {
    "unit": "Unit IV",
    "qNo": 20,
    "marks": 16,
    "questionEnglish": "Explain in detail about pearl harvesting and the process of pearl diving practiced in ancient times.",
    "questionTamil": "பழங்காலத்தில் முத்து சேகரிப்பு மற்றும் முத்துக்குளித்தல் செயல்முறை பற்றி விரிவாக விளக்குக.",
    "answerEnglish": "Introduction:\nPearl diving (முத்துக்குளித்தல்) was one of the most celebrated and economically significant occupations in ancient Tamil Nadu. The Gulf of Mannar (மன்னார் வளைகுடா) and the Palk Strait (பாக் நீர்ச்சன்னல்) were world-renowned pearl fishing zones. Ancient Tamil pearls were traded to Rome, Arabia, Southeast Asia, and China, making them a cornerstone of international commerce. The pearl diving tradition is extensively documented in Sangam literature, classical epics, and foreign accounts.\n\nI. Pearl Fishing Communities:\n\nParathavar (பரதர்):\n• Primary pearl diving community; specialized maritime fishermen of the Neythal (coastal) landscape\n• Lived in villages along the Gulf of Mannar coast — particularly around Tuticorin (Thoothukudi) and Rameswaram\n• Hereditary occupation passed down through generations\n• Expert swimmers and breath-hold divers; trained from childhood\n\nOther Communities:\n• Mukkuvar (முக்குவர்) – another coastal community involved in pearl fishing\n• Arab and foreign traders supervised buying of pearls at coastal markets\n\nII. Pearl Fishing Zones:\n\n1. Gulf of Mannar (மன்னார் வளைகுடா):\n• Between southeastern Tamil Nadu and northwestern Sri Lanka\n• Richest pearl banks (muththuppaadu – முத்துப்பாடு) in the ancient world\n• Best pearl beds located at Tuticorin (Thoothukudi), Vembar, Kilakkarai\n• Pearl oyster species: Pinctada radiata and Pinctada fucata\n\n2. Korkai (கொற்கை):\n• Ancient Pandya port; major pearl trade center\n• Sangam text Malaipadukadam describes pearl fishing at Korkai\n• The Pandya emblem (fish) was partially based on their control of pearl fisheries\n• Later supplanted by Kayal as port\n\n3. Palk Bay:\n• Between Tamil Nadu and Sri Lanka; additional pearl beds\n\nIII. The Process of Pearl Diving:\n\nStep 1 – Seasonal Timing:\n• Pearl diving season: January to April (northeast monsoon has passed; seas calmer)\n• Divers avoided southwest monsoon season (June-September) due to rough seas\n• Lunar calendar consulted for auspicious diving days\n\nStep 2 – Equipment Preparation:\n• Dive boats (pattamaram or small thooni) positioned over pearl banks\n• Rope (paaral – பாரல்) – long rope with a stone weight attached\n• The stone (kal – கல்): a heavy stone called 'kal-murai' attached to the rope to enable rapid descent\n• Mesh bag (oil-treated net bag) attached to the diver's body for collecting oysters\n• Nose clip made of horn or shell to close nostrils\n• Ear protection\n\nStep 3 – The Dive:\n• Diver holds the rope with the attached stone\n• Takes a deep breath; may hyperventilate briefly\n• Steps off the boat, letting the stone carry them rapidly to the seabed (5–15 metres depth)\n• On reaching the bottom, the diver releases the stone (pulled up separately)\n• Diver works rapidly, picking up oysters by hand and placing them in the mesh bag\n• Average time underwater: 60–90 seconds (trained divers could hold breath 2+ minutes)\n• A tug on the rope signals the boat team to pull the diver up quickly\n\nStep 4 – Recovery at Surface:\n• Diver surfaces; takes several breaths before diving again\n• Typically 40–50 dives per day per diver\n• Experienced divers trained to equalize ear pressure\n\nStep 5 – Opening the Oysters:\n• Collected oysters placed in large earthen pots or wooden troughs\n• Left to decompose in the sun or sea water for several days (putrefaction method)\n• After decomposition, oysters opened; flesh removed; pearls extracted\n• Pearls washed, sorted by size, shape, and luster\n\nStep 6 – Pearl Grading and Sale:\n• Pearls graded into categories:\n  - Kuyil mukku (கவியில் முக்கு) – round and lustrous; highest grade\n  - Ivar (இவர்) – slightly imperfect\n  - Meni (மேணி) – seed pearls; smallest\n• Sold at coastal markets (Korkai, Tuticorin) to local traders and foreign merchants\n\nIV. Types of Pearls Produced:\n• Round pearls – most valuable; used in necklaces and earrings\n• Baroque (irregular) pearls – used in cheaper ornaments\n• Seed pearls (சிறு முத்து) – used in delicate jewelry\n• Blister pearls – attached to shell interior; used in specific ornaments\n\nV. Hazards of Pearl Diving:\n• Shallow water blackout (unconsciousness from hyperventilation)\n• Shark attacks (சுறா மீன்) – major hazard; shark charmers (சுறாக்காப்பாளர்) employed\n• Jellyfish stings and coral cuts\n• Ear and sinus barotrauma from pressure changes\n• Exhaustion and drowning\n• Despite hazards, pearl diving continued as a vital livelihood\n\nVI. Economic Importance:\n• Gulf of Mannar pearls were world-famous; mentioned by ancient Roman, Greek, and Arab writers\n• Pliny the Elder (Roman historian) mentions Indian pearls as among the finest in the world\n• Pandya kings derived significant revenue from pearl fishery taxes\n• Pearls were a major export commodity to Rome (Roman coins found at Tamil sites confirm this trade)\n• Mentioned as a prized item in the Periplus of the Erythraean Sea (Greek trade manual)\n\nVII. Literary Evidence:\n\nSangam Literature:\n• Purananuru – describes pearl fishers and their nets along the Korkai coast\n• Akananuru – describes Parathavar diving in the sea\n• Madurai Kanji – mentions pearl trade at Korkai market\n• Natrinai – describes coastal women wearing pearl ornaments\n• Malaipadukadam – detailed description of pearl fishing operations\n\nSilappathikaram:\n• Describes Kannagi's anklet filled with pearls\n• Urukan Kadai chapter mentions pearl (முத்து) as the premier gem worn by women\n• Kovalan and Madhavi's story is set against a backdrop of pearl-wealthy coastal Tamil society\n\nVIII. Archaeological Evidence:\n• Pearl shell deposits at Korkai archaeological site\n• Pearl oyster shells found at Adichanallur burial urns\n• Pearl beads in burial contexts at multiple Tamil Nadu sites\n• Foreign texts (Periplus, Pliny, Marco Polo's later account) confirm Gulf of Mannar pearl trade\n\nIX. Spiritual and Cultural Aspects:\n• Pearl diving had ritual dimensions; offerings made to sea deities before diving season\n• Shark charmers (குமரி மடுவர்) performed protective rituals to ward off shark attacks\n• Pearl divers had their own songs, festivals, and community identity\n• The sea deity Varunan (வருணன்) and coastal goddess were propitiated\n\nConclusion:\nAncient Tamil pearl diving was a highly organized, technically demanding, and economically vital industry. The Parathavar community's remarkable breath-hold diving skills, the sophisticated oyster collection process, and the efficient pearl grading and marketing systems created a world-class pearl industry in the Gulf of Mannar for over two millennia. The Gulf of Mannar pearls enriched Tamil civilization and connected it to global trade networks from Rome to China.\n\nKeywords: pearl diving, Parathavar, Gulf of Mannar, Korkai, Tuticorin, Pandya, Sangam, Silappathikaram, pearl grading, shark, oyster, Periplus",
    "answerTamil": "அறிமுகம்:\nமுத்துக்குளித்தல் பண்டைய தமிழகத்தின் மிகவும் புகழ்பெற்ற மற்றும் பொருளாதார முக்கியத்துவம் வாய்ந்த தொழில்களில் ஒன்றாகும். மன்னார் வளைகுடாவும் பாக் நீர்ச்சன்னலும் உலகளவில் பிரபலமான முத்து மீன்பிடி மண்டலங்களாக இருந்தன. பண்டைய தமிழ் முத்துகள் ரோம், அரேபியா, தென்கிழக்கு ஆசியா மற்றும் சீனாவிற்கு வணிகம் செய்யப்பட்டன.\n\nI. முத்து மீன்பிடி சமூகங்கள்:\n\nபரதர்:\n• முக்கிய முத்துக்குளிக்கும் சமூகம்; நெய்தல் திணையின் சிறப்பு கடல் மீனவர்கள்\n• மன்னார் வளைகுடா கரையோரம் கிராமங்களில் வாழ்ந்தனர் — குறிப்பாக தூத்துக்குடி மற்றும் ராமேஸ்வரம் அருகே\n• தலைமுறை தலைமுறையாக கடைபிடிக்கப்பட்ட பாரம்பரிய தொழில்\n• சிறுவயதிலிருந்து பயிற்சி பெற்ற நிபுணத்துவ நீச்சல் வீரர்கள்\n\nII. முத்து மீன்பிடி மண்டலங்கள்:\n\n1. மன்னார் வளைகுடா:\n• தென்கிழக்கு தமிழ்நாட்டிற்கும் வடமேற்கு இலங்கைக்கும் இடையே\n• பண்டைய உலகில் மிகவும் வளமான முத்துப்பாடுகள்\n• சிறந்த முத்து பாதைகள்: தூத்துக்குடி, வேம்பார், கீழக்கரை\n\n2. கொற்கை:\n• பண்டைய பாண்டிய துறைமுகம்; முக்கிய முத்து வணிக மையம்\n• மலைபடுகடாம் கொற்கையில் முத்து மீன்பிடியை விவரிக்கிறது\n• பாண்டியர் சின்னம் (மீன்) பகுதியாக முத்து மீன்பிடி மேலாண்மையில் அடிப்படை கொண்டது\n\nIII. முத்துக்குளிக்கும் செயல்முறை:\n\nபடிநிலை 1 – பருவகால திட்டமிடல்:\n• முத்துக்குளிக்கும் பருவம்: ஜனவரி-ஏப்ரல் (தென்கிழக்கு பருவமழை கடந்துவிட்டது; கடல் அமைதியாக)\n• தென்மேற்கு பருவமழை பருவம் (ஜூன்-செப்டம்பர்) கடல் கொந்தளிப்பு காரணமாக தவிர்க்கப்பட்டது\n\nபடிநிலை 2 – உபகரண தயாரிப்பு:\n• முத்துப்பாடுகளுக்கு மேல் படகுகள் நிலைப்படுத்தப்பட்டன\n• கயிறு (பாரல்) – கனமான கல் எடை இணைக்கப்பட்ட நீண்ட கயிறு\n• கல் (கல்-முறை) – விரைவாக ஆழத்தில் இறங்குவதற்கு கயிற்றில் இணைக்கப்பட்ட கனமான கல்\n• சிப்பிகளை சேகரிக்க கட்டிய வலை பை\n• மூக்கை மூடும் கொம்பு அல்லது சிப்பியிலிருந்து மூக்கு கவசம்\n\nபடிநிலை 3 – குளிப்பு:\n• மூழ்கி கயிற்றை கல்லுடன் பிடிக்கிறார்\n• ஆழ்ந்த மூச்சு எடுக்கிறார்\n• படகிலிருந்து இறங்கி, கல் அவர்களை வேகமாக கடல் தளத்திற்கு இழுக்கிறது (5-15 மீட்டர் ஆழம்)\n• கடல் தளத்தில் கல்லை விட்டுவிட்டு விரைவாக சிப்பிகளை கையால் பொறுக்கி வலை பையில் போடுகிறார்\n• தண்ணீருக்கு கீழே சராசரி நேரம்: 60-90 வினாடிகள்\n• பயிற்சி பெற்ற மூழ்கிகள் 2+ நிமிடங்கள் மூச்சை தங்க வைத்துக்கொள்ளலாம்\n\nபடிநிலை 4 – சிப்பி திறத்தல்:\n• சிப்பிகளை பெரிய பொம்மை கலயங்களில் வைத்து சூரிய ஒளியில் சில நாட்கள் அழுகல் செய்தனர்\n• முத்துகளை பிரித்தெடுத்து கழுவி, அளவு, வடிவம் மற்றும் ஒளிப்பொலிவு கொண்டு வகைப்படுத்தினர்\n\nபடிநிலை 5 – முத்து தரமிடல் மற்றும் விற்பனை:\n• முத்துகளை வகைகளாக வகைப்படுத்தினர்: கவியில் முக்கு (உட்கார வட்டமான மற்றும் பளபளப்பான; மிக உயர்ந்த தரம்), இவர் (சற்று குறைபாடுள்ளது), மேணி (சிறிய முத்துகள்)\n\nIV. முத்துக்குளிப்பின் ஆபத்துகள்:\n• ஆழமான நீரில் மயக்கம் (மிகை மூச்சிறைப்பு ஏற்படுத்திய சோர்வால்)\n• சுறா மீன் தாக்குதல் – முக்கிய ஆபத்து; சுறாக்காப்பாளர்கள் (குமரி மடுவர்) பணியமர்த்தப்பட்டனர்\n• காது மற்றும் சைனஸ் அழுத்த பாதிப்பு\n\nV. பொருளாதார முக்கியத்துவம்:\n• மன்னார் வளைகுடா முத்துகள் உலகளவில் பிரபலமாக இருந்தன\n• ரோமன் வரலாற்றாசிரியர் பிளினி மூப்பர் இந்திய முத்துகளை உலகின் சிறந்தவற்றில் ஒன்றாக குறிப்பிடுகிறார்\n• ரோம் மற்றும் அரேபியாவுக்கான முக்கிய ஏற்றுமதி பொருளாக இருந்தன\n• Periplus of the Erythraean Sea (கிரேக்க வணிக கையேடு) மதிப்பமிக்க பொருளாக குறிப்பிடுகிறது\n\nVI. இலக்கிய சான்றுகள்:\n• புறநானூறு – கொற்கை கரையில் முத்து மீனவர்களை விவரிக்கிறது\n• மதுரைக்காஞ்சி – கொற்கை சந்தையில் முத்து வணிகத்தை குறிப்பிடுகிறது\n• சிலப்பதிகாரம் – கண்ணகியின் முத்துக் கணுக்காற்கட்டு மற்றும் முத்து (முத்து) ஆகியவற்றை ஊர்காண் காதையில் விவரிக்கிறது\n\nVII. தொல்லியல் சான்றுகள்:\n• கொற்கையில் சிப்பி ஓடு படிவுகள்\n• ஆதிச்சநல்லூர் இடுகாட்டு கலசங்களில் முத்துச்சிப்பி ஓடுகள்\n• பல தமிழகத் தளங்களில் இடுகாட்டு சூழலில் முத்து மணிகள்\n\nவிவரண மற்றும் கலாச்சார அம்சங்கள்:\n• முத்துக்குளிப்பு சடங்கு பரிமாணங்களை கொண்டிருந்தது; குளிக்கும் பருவத்திற்கு முன் கடல் தெய்வங்களுக்கு படையல்\n• சுறாக்காப்பாளர்கள் சுறா தாக்குதல்களை தடுக்க பாதுகாப்பு சடங்குகள் செய்தனர்\n\nமுடிவுரை:\nபண்டைய தமிழ் முத்துக்குளிப்பு மிகவும் ஒழுங்கமைந்த, தொழில்நுட்பம் தேவைப்படும் மற்றும் பொருளாதார முக்கியத்துவம் வாய்ந்த தொழிலாகும். பரதர் சமூகத்தின் மூச்சை பிடித்துக்கொண்டு மூழ்கும் திறன்கள், சிப்பி சேகரிப்பு செயல்முறை மற்றும் திறமையான முத்து தரமிடல் மற்றும் சந்தைப்படுத்தல் முறைகள் மன்னார் வளைகுடாவில் உலகத்தரமான முத்துத் தொழிலை இரண்டு ஆயிரம் ஆண்டுகளுக்கும் மேலாக உருவாக்கின.\n\nமுக்கிய சொற்கள்: முத்துக்குளிப்பு, பரதர், மன்னார் வளைகுடா, கொற்கை, தூத்துக்குடி, பாண்டியர், சிலப்பதிகாரம், முத்து தரமிடல், சுறா மீன், சிப்பி",
    "keywordsEnglish": ["pearl diving", "Parathavar", "Gulf of Mannar", "Korkai", "Tuticorin", "Pandya", "Sangam", "Silappathikaram", "pearl grading", "shark", "oyster"],
    "keywordsTamil": ["முத்துக்குளிப்பு", "பரதர்", "மன்னார் வளைகுடா", "கொற்கை", "தூத்துக்குடி", "பாண்டியர்", "சிலப்பதிகாரம்", "முத்து தரமிடல்", "சுறா", "சிப்பி"]
  },
  {
    "unit": "Unit IV",
    "qNo": 21,
    "marks": 16,
    "questionEnglish": "Write about cattle rearing, livestock management and animal husbandry practices during the Sangam period.",
    "questionTamil": "சங்க காலத்தில் கால்நடை வளர்ப்பு, கால்நடை மேலாண்மை, விலங்கு வளர்ப்பு முறைகள் பற்றி எழுதுக.",
    "answerEnglish": "Introduction:\nCattle rearing and livestock management were central to Sangam-period Tamil economy and social life. The pastoral community (Ayar/Idaiyar) of the Mullai (முல்லை) landscape were master herders. Sangam literature devotes extensive attention to cattle — their breeds, management, diseases, trade, and the culture that grew around them. Cattle represented wealth, social status, and were often the cause of armed conflict (vetchi).\n\nI. Types of Livestock Reared:\n\n1. Cattle (மாடு / மரக்கால்):\n• Most important livestock; the foundation of pastoral economy\n• Bulls (ஏறு / காளை) – used for ploughing, threshing, and ritual combat\n• Cows (பசு) – for milk production and manure\n• Bullocks (ஏர் மாடு) – draft animals for agriculture\n• Breeds: Sangam texts mention specific cattle known for size and strength\n\n2. Buffalo (எருமை):\n• Used for ploughing in wet paddy fields\n• Milk used for butter and curd\n• More suited to marshy, delta landscapes\n\n3. Sheep (செம்மறியாடு):\n• Reared for wool, meat, and ritual sacrifice\n• Managed alongside cattle in pastoral communities\n\n4. Goat (ஆடு):\n• Smaller and more adaptable; reared in hilly and dry zones\n• Milk, meat, and sacrifice\n\n5. Horses (குதிரை):\n• Not bred locally in Tamil Nadu; imported from Arabia and Central Asia\n• Used for warfare and prestige\n• Mentioned extensively in Sangam war poetry\n\n6. Elephants (யானை):\n• Royal animals; used in warfare\n• Captured from forests; not domestically bred as a rule\n• Symbol of royal power\n\n7. Poultry (கோழி):\n• Domestic chicken reared for eggs, meat, and cockfighting\n• Cockfighting (சேவல் போர்) mentioned in Sangam literature as a sport\n\nII. Pastoral Communities and their Role:\n\nAyar (ஆயர்) / Idaiyar (இடையர்):\n• Hereditary cattle herders; associated with Mullai (forest-pastoral) landscape\n• Expert in cattle management, breeding, and veterinary knowledge\n• Krishna (Mayavan) — the divine cowherd — was their primary deity\n• Practiced semi-nomadic lifestyle, moving with cattle to seasonal grazing grounds\n\nMaravar (மறவர்):\n• Martial herders; associated with Palai (arid) landscape\n• Known for cattle raiding and defending cattle\n\nIII. Cattle Management Practices:\n\nGrazing (மேய்ச்சல்):\n• Cattle grazed in forest clearings (காடு), river banks, and meadows\n• Cowherd boys (இடைஞர்) guided cattle to pasture in early morning\n• Cattle returned to the village at dusk; secured in cattle pens (படி)\n• Night watch maintained to prevent predator attacks and cattle theft\n\nWater Management for Cattle:\n• Cattle watered at rivers, streams, forest ponds, and village tanks\n• Special watering points (cattle ghats) maintained at rivers\n• During summer, wells dug in grazing areas for water supply\n\nBreeding:\n• Best bulls (seeded bulls – கடா) kept for breeding\n• Quality of bull determined by physical characteristics (horn shape, body build)\n• Bull worship and bull-taming festivals (Jallikattu – ஜல்லிக்கட்டு) associated with proving bull quality\n\nShelter:\n• Cattle sheds (படி / கோட்டில்) made of thatched palm leaves, wood, and mud\n• Built near the village boundary\n• Lit with torches at night to deter predators and thieves\n\nIV. Jallikattu (ஜல்லிக்கட்டு) – Bull-Taming:\n• Ancient Sangam-period bull-taming sport\n• Young men competed to tame wild bulls as a display of bravery\n• Associated with the Alanganallur (Madurai) tradition\n• Served as a practical test of the bull's strength and temperament for breeding selection\n• Mentioned in Sangam texts and Kalithogai (கலித்தொகை) as 'eruthu thazhuvuthal' (embracing the bull)\n• Archaeological evidence: a Harappan seal shows a bull-taming scene; Tamil tradition is ancient\n\nV. Cattle Products and their Uses:\n\n1. Milk (பால்):\n• Fresh milk drunk by the community\n• Curd (தயிர்), butter (வெண்ணெய்), ghee (நெய்) produced and sold\n• Ghee used in rituals, cooking, and medicine\n\n2. Manure (சாணம்):\n• Cattle dung used as organic manure for fields\n• Essential for maintaining soil fertility\n• Dried dung cakes (வரட்டி) used as fuel\n\n3. Labor (உழைப்பு):\n• Bullocks used for ploughing fields and threshing grain\n• Carts (வண்டி) pulled by bullocks for transport\n\n4. Hide and Bone:\n• Cattle hides processed for leather goods (shoes, drum skins)\n• Bones used for tools and ornaments\n\nVI. Cattle as Wealth and Social Symbol:\n• Cattle were the primary indicator of wealth in pastoral Tamil society\n• Rich chieftains and kings measured wealth in cattle numbers\n• Gift of cattle to poets (bards – பாணர்) was a mark of royal generosity in Sangam literature\n• Purananuru praises kings for giving hundreds of cattle to petitioner-bards\n\nVII. Cattle Raiding (வெட்சி திணை):\n• Cattle raids (வெட்சி) were a common cause of inter-tribal warfare\n• One group raided another's cattle; the raided group retaliated (karavai – காரவை)\n• This warfare pattern is documented as a specific tinai (வெட்சி திணை) in Sangam poetry\n• Warrior poets celebrated successful cattle raids and heroic defense\n• The economic importance of cattle made them a prime target for rivals\n\nVIII. Veterinary Knowledge:\n• Ancient Tamils had empirical knowledge of cattle diseases\n• Herbs and plant-based medicines used to treat cattle\n• Sangam texts describe symptoms of sick cattle and remedies\n• Snake bite (பாம்பு கடி) treatment for cattle mentioned in texts\n\nIX. Cattle in Religion and Culture:\n• Bull (ஏறு / நந்தி) sacred to Shiva; cattle associated with fertility and prosperity\n• Pongal festival (Thai Pongal – தைப்பொங்கல்) celebrated newly harvested rice with cattle worship (Mattu Pongal)\n• Cattle decorated with garlands and turmeric on festival days\n• Bull racing (காளை ஓட்டம்) as entertainment at village festivals\n\nConclusion:\nCattle rearing and livestock management in Sangam-period Tamil Nadu formed a complete economic and cultural system. From the pastoral Ayar communities of the Mullai landscape to the martial Maravars of the Palai regions, from the agricultural bullocks ploughing paddy fields to the fighting bulls of Jallikattu, cattle permeated every aspect of ancient Tamil life. The sophisticated cattle management knowledge, including breeding, veterinary care, seasonal grazing, and water management, demonstrates the depth of ancient Tamil understanding of animal husbandry.\n\nKeywords: Ayar, Idaiyar, Mullai, Jallikattu, Vetchi, cattle raid, bullock, buffalo, Mattu Pongal, pastoral, ghee, manure, bull worship",
    "answerTamil": "அறிமுகம்:\nகால்நடை வளர்ப்பு மற்றும் மேலாண்மை சங்க கால தமிழ் பொருளாதாரம் மற்றும் சமூக வாழ்க்கையின் மையமாக இருந்தது. முல்லை திணையின் மேய்ச்சல் சமூகம் (ஆயர்/இடையர்) கால்நடை மேய்ப்பில் வல்லுநர்கள். சங்க இலக்கியம் கால்நடைகளுக்கு — அவற்றின் இனங்கள், மேலாண்மை, நோய்கள், வணிகம் — விரிவான கவனம் செலுத்துகிறது.\n\nI. வளர்க்கப்படும் கால்நடைகளின் வகைகள்:\n\n1. மாடு:\n• மிக முக்கியமான கால்நடை; மேய்ச்சல் பொருளாதாரத்தின் அடிப்படை\n• காளை – உழவு, கறி மற்றும் சடங்கு சண்டைக்கு\n• பசு – பால் உற்பத்தி மற்றும் எரு\n• ஏர் மாடு – விவசாயத்திற்கான வலிமை விலங்குகள்\n\n2. எருமை:\n• ஈர நெல் வயல்களில் உழவுக்கு பயன்படுகிறது\n• வெண்ணெய் மற்றும் தயிருக்கு பால்\n\n3. செம்மறியாடு:\n• உரோமம், இறைச்சி மற்றும் சடங்கு பலிக்கு\n\n4. ஆடு:\n• மலை மற்றும் வறண்ட மண்டலங்களில் சிறியது மற்றும் தகவலமைவு கொண்டது\n\n5. குதிரை:\n• தமிழகத்தில் உள்ளூரில் வளர்க்கப்படவில்லை; அரேபியா மற்றும் மத்திய ஆசியாவிலிருந்து இறக்குமதி\n• போர் மற்றும் கௌரவத்திற்கு\n\n6. யானை:\n• அரச விலங்குகள்; போரில் பயன்படுகின்றன\n\n7. கோழி:\n• முட்டை, இறைச்சி மற்றும் சேவல் சண்டைக்கு\n• சேவல் போர் (cockfighting) சங்க இலக்கியத்தில் விளையாட்டாக குறிப்பிடப்படுகிறது\n\nII. மேய்ச்சல் சமூகங்கள்:\n\nஆயர் / இடையர்:\n• பரம்பரை கால்நடை மேய்ப்பாளர்கள்; முல்லை திணையுடன் தொடர்புடையோர்\n• கால்நடை மேலாண்மை, இனவளர்ப்பு மற்றும் கால்நடை மருத்துவ அறிவில் வல்லுநர்கள்\n• அரைகுறை நாடோடி வாழ்க்கை; பருவகால மேய்ச்சல் நிலங்களுக்கு கால்நடைகளுடன் நகர்கிறார்கள்\n\nIII. கால்நடை மேலாண்மை நடைமுறைகள்:\n\nமேய்ச்சல்:\n• காட்டு திடல்கள், ஆற்றுக் கரைகள் மற்றும் புல்வெளிகளில் மேயுதல்\n• ஆட்டுக்கார பையன்கள் (இடைஞர்) கால்நடைகளை இடைவேளைக்கு அழைத்துச் செல்கிறார்கள்\n• சாயந்திரம் கிராமத்திற்கு திரும்பி கால்நடை தொழுவங்களில் (படி) வைக்கப்படும்\n\nகால்நடைகளுக்கான நீர் மேலாண்மை:\n• கால்நடைகள் ஆறுகள், நீரோடைகள், காட்டு குளங்கள் மற்றும் கிராம ஏரிகளில் தண்ணீர் குடித்தன\n• கோடை காலத்தில் மேய்ச்சல் பகுதிகளில் தண்ணீர் வழங்க கிணறுகள் தோண்டப்பட்டன\n\nஇனவளர்ப்பு:\n• சிறந்த காளைகள் (கடா) இனவளர்ப்பிற்காக வைக்கப்பட்டன\n• காளையின் தரம் உடல் பண்புகளால் தீர்மானிக்கப்பட்டது\n• ஜல்லிக்கட்டு – காளையின் தரத்தை நிரூபிக்கும் திருவிழா\n\nIV. ஜல்லிக்கட்டு – காளை தழுவுதல்:\n• பண்டைய சங்க கால காளை தழுவுதல் விளையாட்டு\n• இளைஞர்கள் வீரத்தின் வெளிப்பாடாக காட்டுக் காளைகளை தழுவ போட்டியிட்டனர்\n• இனவளர்ப்பு தேர்வுக்காக காளையின் வலிமை மற்றும் குணத்தை நடைமுறையில் சோதிக்கும்\n• சங்க நூல்கள் மற்றும் கலித்தொகையில் 'எருது தழுவுதல்' என்று குறிப்பிடப்படுகிறது\n\nV. கால்நடை விளைவுகள்:\n• பால் – குடும்பம் குடிக்கும்; தயிர், வெண்ணெய், நெய் தயாரிக்கப்பட்டு விற்கப்பட்டன\n• சாணம் – கலப்புக்கு கரிம உரம்; உலர்ந்த சாண கட்டிகள் (வரட்டி) எரிபொருளாக\n• உழைப்பு – ஏர் மாடுகள் வயல்களை உழுவதற்கும் தானியம் கறிக்கவும் பயன்படுத்தப்பட்டன\n• தோல் மற்றும் எலும்பு – தோல் பொருட்கள் மற்றும் கருவிகளுக்கு\n\nVI. கால்நடைகள் செல்வமாகவும் சமூக சின்னமாகவும்:\n• கால்நடைகள் மேய்ச்சல் தமிழ் சமூகத்தில் செல்வத்தின் முதன்மை அறிகுறியாக இருந்தன\n• கவிஞர்களுக்கு (பாணர்) கால்நடை வழங்குவது அரச நன்கொடையின் அடையாளம்\n\nVII. கால்நடை கொள்ளை (வெட்சி திணை):\n• வெட்சி – பொதுவான அனைத்து பழங்குடி போர்களின் காரணம்\n• ஒரு குழு மற்றொரு குழுவின் கால்நடைகளை கொள்ளையடிக்கும்; கொள்ளையிடப்பட்ட குழு பதிலடி கொடுக்கும் (காரவை)\n• சங்க கவிதையில் குறிப்பிட்ட திணையாக (வெட்சி திணை) ஆவணப்படுத்தப்பட்டது\n\nVIII. கால்நடை மருத்துவ அறிவு:\n• பண்டைய தமிழர்கள் கால்நடை நோய்களை அனுபவ ரீதியில் அறிந்திருந்தனர்\n• கால்நடைகளுக்கு மூலிகை மற்றும் தாவர அடிப்படையிலான மருந்துகள் பயன்படுத்தப்பட்டன\n\nIX. மதம் மற்றும் கலாச்சாரத்தில் கால்நடை:\n• காளை (நந்தி) சிவனுக்கு புனிதம்; கால்நடைகள் வளமை மற்றும் செழிப்புடன் தொடர்புடையவை\n• பொங்கல் திருவிழாவில் கால்நடை வழிபாடு (மட்டு பொங்கல்)\n• திருவிழா நாட்களில் கால்நடைகளை மாலைகள் மற்றும் மஞ்சளால் அலங்கரித்தனர்\n\nமுடிவுரை:\nசங்க கால தமிழகத்தில் கால்நடை வளர்ப்பு மற்றும் மேலாண்மை ஒரு முழுமையான பொருளாதார மற்றும் கலாச்சார அமைப்பை உருவாக்கியது. ஆயர் சமூகங்களிலிருந்து மறவர்களுக்கும், விவசாய நெல் வயல்களில் உழுத ஏர் மாடுகளிலிருந்து ஜல்லிக்கட்டின் சண்டை காளைகள் வரை, கால்நடைகள் பண்டைய தமிழ் வாழ்க்கையின் ஒவ்வொரு அம்சத்தையும் ஊடுருவின.\n\nமுக்கிய சொற்கள்: ஆயர், இடையர், முல்லை, ஜல்லிக்கட்டு, வெட்சி, கால்நடை கொள்ளை, ஏர் மாடு, எருமை, மட்டு பொங்கல், நெய், சாணம்",
    "keywordsEnglish": ["Ayar", "Idaiyar", "Mullai", "Jallikattu", "Vetchi", "cattle raid", "bullock", "buffalo", "Mattu Pongal", "pastoral", "ghee", "manure", "bull worship"],
    "keywordsTamil": ["ஆயர்", "இடையர்", "முல்லை", "ஜல்லிக்கட்டு", "வெட்சி", "கால்நடை கொள்ளை", "ஏர் மாடு", "எருமை", "மட்டு பொங்கல்", "நெய்", "சாணம்"]
  },

  // ─── UNIT V ───
  {
    unit: "Unit V", qNo: 1, marks: 2,
    questionEnglish: "Write a note on Computational Tamil (Kanithamizh).",
    questionTamil: "கணித்தமிழ் குறிப்பு எழுக.",
    answerEnglish: "Computational Tamil (கணித்தமிழ்) is the application of information technology to the Tamil language. It includes Unicode encoding, natural language processing (NLP), text-to-speech, speech recognition, machine translation, and Tamil software development — preserving and expanding Tamil in the digital world.",
    answerTamil: "கணித்தமிழ் என்பது தகவல் தொழில்நுட்பத்தை தமிழ் மொழியில் பயன்படுத்துவது. யுனிகோட் குறியாக்கம், NLP, உரை-பேச்சு, பேச்சு அங்கீகாரம், இயந்திர மொழிபெயர்ப்பு, தமிழ் மென்பொருள் உருவாக்கம் அடங்கும். டிஜிட்டல் உலகில் தமிழை பாதுகாக்கவும் விரிவுபடுத்தவும் நோக்கமுடையது.",
    keywordsEnglish: ["Kanithamizh", "Unicode", "NLP", "Tamil software", "digital"],
    keywordsTamil: ["கணித்தமிழ்", "யுனிகோட்", "NLP", "தமிழ் மென்பொருள்"],
  },
  {
    unit: "Unit V", qNo: 2, marks: 2,
    questionEnglish: "In which year was the Tamil Virtual Academy established?",
    questionTamil: "தமிழ் இணையக் கல்விக் கழகம் எந்த ஆண்டு தொடங்கப்பட்டது?",
    answerEnglish: "The Tamil Virtual Academy (TIVA – தமிழ் இணையக் கல்விக் கழகம்) was established in 2001 by the Tamil Nadu Government. Previously called 'Tamil Internet Education', it provides online Tamil learning resources, e-books, dictionaries, and courses.",
    answerTamil: "தமிழ் இணையக் கல்விக் கழகம் (TIVA) 2001ஆம் ஆண்டில் தமிழ்நாடு அரசால் தொடங்கப்பட்டது. முன்பு 'தமிழ் இணைய கல்வி' என்று அழைக்கப்பட்டது. ஆன்லைன் தமிழ் கல்வி வளங்கள், மின்னூல்கள், அகராதிகள், படிப்புகளை வழங்குகிறது.",
    keywordsEnglish: ["Tamil Virtual Academy", "2001", "TIVA", "Tamil Nadu Government"],
    keywordsTamil: ["தமிழ் இணையக் கல்விக் கழகம்", "2001", "TIVA"],
  },
  {
    unit: "Unit V", qNo: 3, marks: 2,
    questionEnglish: "Name three e-learning systems.",
    questionTamil: "மின்னூல் அமைப்புகள் மூன்றினைக் கூறுக.",
    answerEnglish: "Three e-learning systems: (1) Tamil Virtual Academy (TIVA) – online Tamil education; (2) SWAYAM – Indian government's open online education platform; (3) MOOC (Massive Open Online Courses) – platforms like Coursera and edX offering free global courses.",
    answerTamil: "மூன்று மின்கல்வி அமைப்புகள்: (1) TIVA – ஆன்லைன் தமிழ் கல்வி; (2) SWAYAM – இந்திய அரசின் ஆன்லைன் கல்வி தளம்; (3) MOOC – Coursera, edX போன்ற தளங்கள் வழங்கும் திறந்தநிலை ஆன்லைன் படிப்புகள்.",
    keywordsEnglish: ["TIVA", "SWAYAM", "MOOC", "e-learning"],
    keywordsTamil: ["TIVA", "SWAYAM", "MOOC", "மின்கல்வி"],
  },
  {
    unit: "Unit V", qNo: 4, marks: 2,
    questionEnglish: "List the institutions where Tamil software is developed.",
    questionTamil: "தமிழ் மென்பொருள் உருவாக்கும் இடங்களைக்கூறுக.",
    answerEnglish: "Institutions developing Tamil software: (1) TIVA – Tamil Virtual Academy, Chennai; (2) CIIL – Central Institute of Indian Languages, Mysore; (3) AU-KBC Research Centre, Anna University, Chennai; (4) TDIL – Technology Development for Indian Languages, Govt. of India; (5) C-DAC, Pune.",
    answerTamil: "தமிழ் மென்பொருள் உருவாக்கும் நிறுவனங்கள்: (1) TIVA – சென்னை; (2) CIIL – மத்திய இந்திய மொழிகள் நிறுவனம், மைசூர்; (3) AU-KBC ஆராய்ச்சி மையம், அண்ணா பல்கலைக்கழகம்; (4) TDIL – இந்திய அரசு; (5) C-DAC, புனே.",
    keywordsEnglish: ["TIVA", "CIIL", "AU-KBC", "TDIL", "C-DAC"],
    keywordsTamil: ["TIVA", "CIIL", "AU-KBC", "TDIL", "C-DAC"],
  },
  {
    unit: "Unit V", qNo: 5, marks: 2,
    questionEnglish: "Write a note on digital libraries.",
    questionTamil: "மின் நூலகம் குறிப்பு எழுக.",
    answerEnglish: "A digital library (மின் நூலகம்) is a collection of books, articles, audio, and video accessible via the internet. Tamil digital libraries include Tamil Digital Library (tamildigitallibrary.in) and Project Madurai. Benefits: 24/7 access, easy search, no physical space needed, and preservation of rare manuscripts.",
    answerTamil: "மின் நூலகம் என்பது இணையம் வழியாக புத்தகங்கள், கட்டுரைகள், ஒலி, காணொலி அணுகக்கூடிய தொகுப்பு. தமிழ் டிஜிட்டல் நூலகம் மற்றும் திட்டம் மதுரை பண்டைய தமிழ் நூல்களை டிஜிட்டல் வடிவாக்குகின்றன. நன்மைகள்: 24/7 அணுகல், எளிய தேடல், அரிய ஏடுகள் பாதுகாப்பு.",
    keywordsEnglish: ["digital library", "Project Madurai", "Tamil texts", "24/7 access"],
    keywordsTamil: ["மின் நூலகம்", "திட்டம் மதுரை", "தமிழ் நூல்கள்", "24/7 அணுகல்"],
  },
  {
    unit: "Unit V", qNo: 6, marks: 2,
    questionEnglish: "Write about online dictionaries.",
    questionTamil: "மின் அகராதி குறித்து எழுதுக.",
    answerEnglish: "Online dictionaries (மின் அகராதி) provide instant word definitions, translations, and usage examples via the internet. Tamil online dictionaries include: University of Madras Tamil Lexicon, Maduram Online Dictionary, Tamil Wiktionary, and Agaraadhi.org. They help students, researchers, and Tamil learners worldwide.",
    answerTamil: "மின் அகராதிகள் இணையம் வழியாக உடனடி சொல் விளக்கங்கள், மொழிபெயர்ப்புகள் மற்றும் பயன்பாட்டு எடுத்துக்காட்டுகளை வழங்குகின்றன. தமிழ் ஆன்லைன் அகராதிகள்: சென்னை பல்கலைக்கழக தமிழ் அகராதி, மதுரம், தமிழ் விக்சனரி, அகராதி.org.",
    keywordsEnglish: ["online dictionary", "Tamil Lexicon", "Maduram", "Tamil Wiktionary"],
    keywordsTamil: ["மின் அகராதி", "தமிழ் அகராதி", "மதுரம்", "தமிழ் விக்சனரி"],
  },
  {
    unit: "Unit V", qNo: 7, marks: 2,
    questionEnglish: "How many components are there in the Madhuram Online Dictionary?",
    questionTamil: "மதுரம் மின் அகராதியில் எத்தனை கூறுகள் உள்ளன?",
    answerEnglish: "The Maduram Online Dictionary contains multiple components: Tamil-Tamil definitions, Tamil-English translations, Tamil-Sanskrit cross-references, proverbs (பழமொழி), idioms (சொற்றொடர்), and example sentences. It is one of the most comprehensive Tamil digital dictionaries.",
    answerTamil: "மதுரம் மின் அகராதி பல கூறுகளை கொண்டுள்ளது: தமிழ்-தமிழ் வரையறைகள், தமிழ்-ஆங்கிலம் மொழிபெயர்ப்புகள், தமிழ்-சமஸ்கிருதம் குறிப்புகள், பழமொழிகள், சொற்றொடர்கள் மற்றும் எடுத்துக்காட்டு வாக்கியங்கள்.",
    keywordsEnglish: ["Maduram", "Tamil-Tamil", "Tamil-English", "proverbs", "idioms"],
    keywordsTamil: ["மதுரம்", "தமிழ்-தமிழ்", "தமிழ்-ஆங்கிலம்", "பழமொழி"],
  },
  {
    unit: "Unit V", qNo: 8, marks: 2,
    questionEnglish: "Write a note on Tamil Wiktionary.",
    questionTamil: "தமிழ் விக்சனரி - குறிப்பு எழுக.",
    answerEnglish: "Tamil Wiktionary is a free, community-edited multilingual dictionary under Wikimedia Foundation. It provides Tamil word definitions, etymologies, translations into 100+ languages, and pronunciation guides. Anyone can add or edit entries, helping preserve and document Tamil vocabulary in the digital age.",
    answerTamil: "தமிழ் விக்சனரி விக்கிமீடியா அறக்கட்டளையின் கீழ் இயங்கும் இலவச, சமூக திருத்தப்படும் பன்மொழி அகராதி. தமிழ் சொல் வரையறைகள், சொற்பிறப்பியல், 100+ மொழி மொழிபெயர்ப்புகள் வழங்குகிறது. யாரும் சொற்களை சேர்க்கலாம் அல்லது திருத்தலாம்.",
    keywordsEnglish: ["Tamil Wiktionary", "Wikimedia", "free", "multilingual"],
    keywordsTamil: ["தமிழ் விக்சனரி", "விக்கிமீடியா", "இலவச", "பன்மொழி"],
  },
  {
    unit: "Unit V", qNo: 9, marks: 2,
    questionEnglish: "What is Sorkuvai Thittam?",
    questionTamil: "சொற்குவை திட்டம் என்றால் என்ன?",
    answerEnglish: "Sorkuvai Thittam (சொற்குவை திட்டம் – 'Word Treasury Project') is a digital corpus project that collects, organizes, and digitizes Tamil words and texts. It builds a comprehensive Tamil word database for natural language processing, linguistic research, and lexicography.",
    answerTamil: "சொற்குவை திட்டம் ('சொல் கருவூலம்') தமிழ் சொற்கள் மற்றும் நூல்களின் பெரிய தொகுப்பை சேகரித்து, ஒழுங்கமைத்து டிஜிட்டல் வடிவாக்கும் திட்டம். இயற்கை மொழி செயலாக்கம், மொழியியல் ஆராய்ச்சி, அகராதியியலுக்கான விரிவான தமிழ் சொல் தரவுத்தளம் உருவாக்குகிறது.",
    keywordsEnglish: ["Sorkuvai Thittam", "word corpus", "Tamil NLP", "lexicography"],
    keywordsTamil: ["சொற்குவை திட்டம்", "சொல் தொகுப்பு", "NLP", "அகராதியியல்"],
  },
  {
    unit: "Unit V", qNo: 10, marks: 2,
    questionEnglish: "What are the primary objectives of a Sorkuvai?",
    questionTamil: "சொற்குவையின் முதன்மை நோக்கங்கள் யாவை?",
    answerEnglish: "Primary objectives of Sorkuvai: (1) Collect and archive Tamil vocabulary from all time periods; (2) Create a searchable Tamil word corpus for linguistic research; (3) Support Tamil NLP tools; (4) Preserve rare and archaic Tamil words; (5) Facilitate Tamil machine translation.",
    answerTamil: "சொற்குவையின் முதன்மை நோக்கங்கள்: (1) அனைத்து காலகட்டங்களிலும் தமிழ் சொல்வளஞ்சேரியை சேகரிக்கல்; (2) மொழியியல் ஆராய்ச்சிக்கு தேடக்கூடிய corpus உருவாக்கல்; (3) தமிழ் NLP கருவிகளை ஆதரித்தல்; (4) அரிய சொற்கள் பாதுகாத்தல்; (5) இயந்திர மொழிபெயர்ப்பு எளிதாக்கல்.",
    keywordsEnglish: ["Sorkuvai", "vocabulary archive", "NLP", "preservation"],
    keywordsTamil: ["சொற்குவை", "சொல் காப்பு", "NLP", "பாதுகாப்பு"],
  },
  {
    unit: "Unit V", qNo: 11, marks: 2,
    questionEnglish: "What was the previous name of the Tamil Virtual Academy?",
    questionTamil: "தமிழ் இணையக்கல்விக்கழகத்தின் முன்னைய பெயர் என்ன?",
    answerEnglish: "The Tamil Virtual Academy (TIVA) was previously known as 'Tamil Internet Education' (தமிழ் இணைய கல்வி). Established in 2001, it was later renamed Tamil Virtual Academy. It operates under the Tamil Nadu Government and promotes Tamil through digital platforms and e-learning.",
    answerTamil: "தமிழ் இணையக் கல்விக் கழகம் (TIVA) முன்பு 'தமிழ் இணைய கல்வி' என்று அழைக்கப்பட்டது. 2001ல் தொடங்கி பின்னர் மறுபெயரிடப்பட்டது. தமிழ்நாடு அரசின் கீழ் டிஜிட்டல் தளங்கள் மற்றும் மின்கல்வி மூலம் தமிழை மேம்படுத்துகிறது.",
    keywordsEnglish: ["Tamil Virtual Academy", "Tamil Internet Education", "2001", "TIVA"],
    keywordsTamil: ["தமிழ் இணையக் கல்விக் கழகம்", "தமிழ் இணைய கல்வி", "2001"],
  },
  {
    unit: "Unit V", qNo: 12, marks: 2,
    questionEnglish: "Write a note on blogs.",
    questionTamil: "கலப்பூ - குறிப்பு எழுக.",
    answerEnglish: "A blog (கலப்பூ) is a regularly updated website where individuals write articles, opinions, or creative content. Tamil blogs have significantly promoted Tamil literature, culture, and language online. Platforms like Blogger and WordPress host millions of Tamil blogs written by enthusiasts worldwide.",
    answerTamil: "கலப்பூ (Blog) என்பது தனிநபர்கள் கட்டுரைகள், கருத்துகள் அல்லது படைப்பு உள்ளடக்கத்தை எழுதும் தொடர்ச்சியாக புதுப்பிக்கப்படும் இணைதளம். தமிழ் கலப்பூக்கள் ஆன்லைனில் தமிழ் இலக்கியம், கலாச்சாரம் மேம்படுத்துவதில் குறிப்பிடத்தக்க பங்களித்தன.",
    keywordsEnglish: ["blog", "Tamil blog", "WordPress", "online writing"],
    keywordsTamil: ["கலப்பூ", "தமிழ் கலப்பூ", "WordPress", "ஆன்லைன் எழுத்து"],
  },
  {
    unit: "Unit V", qNo: 13, marks: 2,
    questionEnglish: "Write about the development of Tamil in the blogs.",
    questionTamil: "கலப்பூவில் தமிழ் வளர்ச்சி குறித்து எழுதுக.",
    answerEnglish: "Tamil blogs have grown significantly since the 2000s, serving as platforms for creative writing, political commentary, technology discussions, and cultural journalism. Bloggers' associations organized meets and awards. Blogs democratized Tamil literary production by enabling young writers to publish freely online.",
    answerTamil: "தமிழ் கலப்பூக்கள் 2000களிலிருந்து குறிப்பிடத்தக்க அளவில் வளர்ந்தன. படைப்பு எழுத்து, அரசியல் விமர்சனம், தொழில்நுட்ப விவாதங்கள், கலாச்சார தளங்களாக செயல்படுகின்றன. கலப்பூர் சங்கங்கள் விருதுகள் ஏற்பாடு செய்தன. இளம் எழுத்தாளர்களுக்கு இலவசமாக வெளியிட உதவியது.",
    keywordsEnglish: ["Tamil blogs", "creative writing", "bloggers community", "2000s"],
    keywordsTamil: ["தமிழ் கலப்பூ", "படைப்பு எழுத்து", "கலப்பூர் சங்கம்"],
  },
  {
    unit: "Unit V", qNo: 14, marks: 2,
    questionEnglish: "Write a brief note on online Tamil dictionaries.",
    questionTamil: "இணையத்தில் தமிழ் அகராதிகள் குறித்து சிறு குறிப்பு எழுக.",
    answerEnglish: "Online Tamil dictionaries have made Tamil vocabulary globally accessible. Major ones: University of Madras Tamil Lexicon Online, Tamil Wiktionary, Maduram Online Dictionary, Agaraadhi.com, and Sabdatharavali. These free digital tools support Tamil learners, translators, and researchers worldwide.",
    answerTamil: "ஆன்லைன் தமிழ் அகராதிகள் தமிழ் சொல்வளஞ்சேரியை உலகளவில் அணுகக்கூடியதாக ஆக்கியுள்ளன. முக்கியவை: சென்னை பல்கலைக்கழக தமிழ் அகராதி, தமிழ் விக்சனரி, மதுரம், அகராதி.com, சப்தத்தாரவளி. இலவச டிஜிட்டல் கருவிகள் உலகளவில் தமிழ் கற்பவர்களுக்கு ஆதரவளிக்கின்றன.",
    keywordsEnglish: ["Tamil Lexicon", "Tamil Wiktionary", "Maduram", "Agaraadhi"],
    keywordsTamil: ["தமிழ் அகராதி", "தமிழ் விக்சனரி", "மதுரம்", "அகராதி.com"],
  },
  {
    unit: "Unit V", qNo: 15, marks: 2,
    questionEnglish: "What are the benefits of Tamil software development?",
    questionTamil: "தமிழ் மென்பொருள் உருவாக்கத்தின் பயன்கள் யாவை?",
    answerEnglish: "Benefits of Tamil software development: (1) Enables Tamil speakers to use computers in their native language; (2) Promotes digital literacy; (3) Preserves Tamil in the digital era; (4) Supports Tamil e-governance; (5) Creates IT employment; (6) Enables Tamil NLP for AI and machine translation.",
    answerTamil: "தமிழ் மென்பொருள் உருவாக்கத்தின் பயன்கள்: (1) தாய்மொழியில் கணினி பயன்பாடு; (2) டிஜிட்டல் கல்வியறிவு மேம்பாடு; (3) டிஜிட்டல் யுகத்தில் தமிழ் பாதுகாப்பு; (4) தமிழ் மின்-நிர்வாக ஆதரவு; (5) IT வேலைவாய்ப்பு; (6) AI மற்றும் இயந்திர மொழிபெயர்ப்புக்கு தமிழ் NLP.",
    keywordsEnglish: ["Tamil software", "digital literacy", "e-governance", "NLP", "AI"],
    keywordsTamil: ["தமிழ் மென்பொருள்", "டிஜிட்டல் கல்வியறிவு", "மின்-நிர்வாகம்", "NLP"],
  },
  {
    "unit": "Unit V",
    "qNo": 16,
    "marks": 16,
    "questionEnglish": "Explain in detail the development of computer Tamil (Kanithamizh).",
    "questionTamil": "கணித்தமிழ் வளர்ச்சி குறித்து விரிந்து எழுதுக.",
    "answerEnglish": "Introduction:\nComputational Tamil or Kanithamizh (கணித்தமிழ்) refers to the systematic application of information technology, computational linguistics, and digital tools to the Tamil language. As one of the world's classical languages with over 2,000 years of literary tradition, Tamil faced significant challenges adapting to the digital age. The development of Kanithamizh has been a crucial mission to ensure Tamil survives and thrives in the 21st century digital world.\n\nI. Early Challenges in Digitizing Tamil:\n\n1. Script Complexity:\n• Tamil script has 247 characters (12 vowels, 18 consonants, 216 combined characters, and special character ஃ)\n• Each character takes multiple keystrokes on a standard keyboard\n• Early computers designed for Latin-script; Tamil required specialized encoding\n\n2. Encoding Inconsistencies:\n• Before Unicode, multiple incompatible Tamil encodings existed:\n  - TSCII (Tamil Script Code for Information Interchange)\n  - TAB encoding\n  - Various proprietary font-based encodings (Bamini, Latha, etc.)\n• Documents created in one encoding unreadable in another system\n\nII. Unicode and Standardization:\n\nUnicode for Tamil:\n• Tamil was among the first Indian languages to receive Unicode support\n• Tamil Unicode block: U+0B80–U+0BFF\n• Enabled universal display and exchange of Tamil text across all platforms\n• Tamil Virtual Academy (TIVA) and C-DAC contributed to Unicode standardization\n• Typefaces like Tamil99 keyboard layout standardized data entry\n\nTamil99 Keyboard:\n• Standardized keyboard layout developed by Tamil Nadu Government\n• Based on Tamil phonology; efficient for Tamil typists\n• Adopted in government offices, schools, and publications\n\nIII. Key Institutions in Tamil Computing Development:\n\n1. Tamil Virtual Academy (தமிழ் இணையக் கல்விக் கழகம் – TIVA):\n• Established 2001 by Tamil Nadu Government\n• Promotes Tamil through internet and digital platforms\n• Digitized thousands of ancient Tamil texts\n• Developed online Tamil dictionaries, e-learning courses\n\n2. AU-KBC Research Centre (Anna University):\n• Pioneering Tamil NLP research\n• Developed Tamil speech recognition systems\n• Corpus creation and Tamil morphological analysis\n\n3. Technology Development for Indian Languages (TDIL):\n• Central Government initiative\n• Funded Tamil NLP, machine translation, and corpus projects\n\n4. C-DAC (Centre for Development of Advanced Computing):\n• Developed GIST technology for Indian languages including Tamil\n• Tamil spell checkers and grammar tools\n\n5. Central Institute of Indian Languages (CIIL), Mysore:\n• Linguistic research; Tamil corpus development\n\nIV. Key Areas of Tamil Computing Development:\n\n1. Tamil Natural Language Processing (NLP – இயற்கை மொழி செயலாக்கம்):\n• Morphological Analysis – breaking Tamil words into roots and affixes\n• Part-of-speech tagging – identifying nouns, verbs, adjectives\n• Named Entity Recognition – identifying proper nouns\n• Sentiment Analysis – understanding emotion in text\n• Text Summarization – automatic summarization of Tamil documents\n\n2. Machine Translation (இயந்திர மொழிபெயர்ப்பு):\n• Tamil-English and English-Tamil automatic translation systems\n• Google Translate – now supports Tamil\n• Research on rule-based and neural machine translation for Tamil\n\n3. Tamil Text-to-Speech (TTS – உரை-பேச்சு):\n• Systems that read out Tamil text in synthetic voice\n• Valuable for visually impaired users\n• Several TTS engines developed by TIVA and research institutions\n\n4. Tamil Speech Recognition (பேச்சு அங்கீகாரம்):\n• Systems that convert spoken Tamil into text\n• Used in voice assistants and accessibility applications\n• Google Voice and Siri now support Tamil speech input\n\n5. Tamil Optical Character Recognition (OCR – ஒப்டிகல் கேரக்டர் அங்கீகரிப்பு):\n• Software that converts images of Tamil text into digital text\n• Critical for digitizing old Tamil manuscripts and books\n• Tamil OCR used in Project Madurai and library digitization projects\n\n6. Digital Tamil Dictionaries (மின் அகராதிகள்):\n• University of Madras Tamil Lexicon digitized online\n• Tamil Wiktionary – community-built multilingual dictionary\n• Maduram Online Dictionary – comprehensive Tamil reference\n\n7. Tamil Corpus (சொற்குவை – Sorkuvai):\n• Large collection of Tamil texts used for linguistic research\n• Enables training of NLP models and AI systems\n• Sorkuvai Thittam – government project to build Tamil word corpus\n\nV. E-Learning and Tamil Education Technology:\n\n1. Tamil Virtual Academy (TIVA):\n• Online Tamil language courses at beginner, intermediate, and advanced levels\n• Tamil literature, grammar, and culture courses\n• Certificate programs accessible worldwide\n\n2. Tamil Textbooks Online:\n• Tamil Nadu school textbooks available as PDF and interactive digital formats\n• Open Educational Resources for Tamil\n\n3. Tamil Wikipedia:\n• Over 150,000 articles in Tamil\n• Community-maintained encyclopedia\n\n4. Tamil Blogs (கலப்பூ) and Social Media:\n• Millions of Tamil blogs; vibrant online literary community\n• Tamil on Twitter, Facebook, Instagram, YouTube\n• Tamil podcasts and digital audio books\n\nVI. Tamil in Mobile and Digital Platforms:\n• Android and iOS fully support Tamil script display and input\n• Tamil keyboard apps: Settu Tamil Keyboard, SwiftKey Tamil\n• WhatsApp, Gmail, and major platforms support Tamil input\n• Tamil language interface in smartphones and computers\n\nVII. Digital Preservation of Tamil Heritage:\n• Project Madurai – digitizes rare Tamil books and palmleaf manuscripts\n• Tamil Digital Library (tamildigitallibrary.in) – 100,000+ Tamil works digitized\n• Digitization of Sangam poetry, medieval texts, inscriptions\n\nVIII. Challenges Remaining:\n1. Insufficient Tamil training data for AI models\n2. Dialectal variation (spoken Tamil varies greatly from written Tamil)\n3. Need for better Tamil OCR for old printed texts\n4. Code-switching (Tamil-English mix) handling in NLP\n5. Low resource language issues for neural translation\n\nIX. Future Directions:\n• Tamil AI language models (LLMs) for text generation\n• Voice-based Tamil interfaces for the elderly and less literate\n• Tamil in augmented reality and virtual reality applications\n• Real-time Tamil translation tools\n\nConclusion:\nThe development of Kanithamizh has been a remarkable journey from encoding inconsistency to Unicode standardization, from primitive text displays to sophisticated AI-powered Tamil language tools. Through the efforts of government institutions, research universities, and global Tamil communities, Tamil now participates fully in the digital world. Continued investment in Tamil computing is essential to ensure that one of the world's oldest living classical languages thrives in the digital era.\n\nKeywords: Kanithamizh, Unicode, TIVA, NLP, machine translation, Tamil speech recognition, OCR, Tamil corpus, Sorkuvai, Tamil Wikipedia, Project Madurai",
    "answerTamil": "அறிமுகம்:\nகணித்தமிழ் என்பது தகவல் தொழில்நுட்பம், கணினி மொழியியல் மற்றும் டிஜிட்டல் கருவிகளை தமிழ் மொழியில் முறையான பயன்படுத்துதலை குறிக்கிறது. 2,000 ஆண்டுகளுக்கும் மேலான இலக்கிய பாரம்பரியம் கொண்ட தமிழ் டிஜிட்டல் யுகத்தில் தழைத்து வளர்வதை உறுதி செய்வது இந்த பணியின் முக்கிய நோக்கமாகும்.\n\nI. தமிழை டிஜிட்டல் வடிவாக்குவதில் ஆரம்பகால சவால்கள்:\n\n1. எழுத்துமுறை சிக்கல்:\n• தமிழ் எழுத்துமுறையில் 247 எழுத்துகள் (12 உயிர்கள், 18 மெய்கள், 216 உயிர்மெய்கள் மற்றும் ஒரு சிறப்பு எழுத்து)\n• ஒவ்வொரு எழுத்திலும் பல விசை அழுத்தல்கள் தேவை\n• ஆரம்ப கணினிகள் லத்தீன் எழுத்துமுறைக்காக வடிவமைக்கப்பட்டன\n\n2. குறியாக்க ஒத்திசைவின்மை:\n• யுனிகோட்டிற்கு முன் பல இணக்கமற்ற தமிழ் குறியாக்கங்கள்: TSCII, TAB, பாமினி, லதா போன்ற தனியுரிம குறியாக்கங்கள்\n\nII. யுனிகோட் மற்றும் தரப்படுத்தல்:\n• தமிழ் தொடக்கத்திலேயே யுனிகோட் ஆதரவு பெற்ற இந்திய மொழிகளில் ஒன்று\n• தமிழ் யுனிகோட் தொகுதி: U+0B80–U+0BFF\n• அனைத்து தளங்களிலும் தமிழ் உரையை உலகளாவிய வகையில் காட்டவும் பரிமாறவும் வழிவகை செய்தது\n• தமிழ்99 விசைப்பலகை அமைப்பு – தமிழ்நாடு அரசு உருவாக்கிய தரப்படுத்தப்பட்ட விசைப்பலகை\n\nIII. தமிழ் கணினி வளர்ச்சியில் முக்கிய நிறுவனங்கள்:\n\n1. தமிழ் இணையக் கல்விக் கழகம் (TIVA):\n• 2001ல் தமிழ்நாடு அரசால் நிறுவப்பட்டது\n• ஆயிரக்கணக்கான பண்டைய தமிழ் நூல்களை டிஜிட்டல் வடிவாக்கியது\n• ஆன்லைன் தமிழ் அகராதிகள், மின்கல்வி படிப்புகள் உருவாக்கியது\n\n2. AU-KBC ஆராய்ச்சி மையம் (அண்ணா பல்கலைக்கழகம்):\n• முன்னோடி தமிழ் NLP ஆராய்ச்சி\n• தமிழ் பேச்சு அங்கீகார அமைப்புகள் உருவாக்கியது\n\n3. TDIL – இந்திய மொழிகளுக்கான தொழில்நுட்ப மேம்பாடு:\n• தமிழ் NLP, இயந்திர மொழிபெயர்ப்பு மற்றும் தொகுப்பு திட்டங்களுக்கு நிதியுதவி\n\nIV. தமிழ் கணினி வளர்ச்சியின் முக்கிய பகுதிகள்:\n\n1. தமிழ் இயற்கை மொழி செயலாக்கம் (NLP):\n• உருபன் பகுப்பாய்வு – தமிழ் சொற்களை வேர்கள் மற்றும் விகுதிகளாக பிரிக்கிறது\n• பேச்சுப் பகுதி குறிப்பிடல் – பெயர்ச்சொல், வினைச்சொல், பண்படைச்சொல் அடையாளம் காணல்\n• உணர்வு பகுப்பாய்வு – உரையில் உணர்ச்சியை புரிந்துகொள்ளல்\n\n2. இயந்திர மொழிபெயர்ப்பு:\n• தமிழ்-ஆங்கிலம் மற்றும் ஆங்கிலம்-தமிழ் தானியங்கி மொழிபெயர்ப்பு அமைப்புகள்\n• Google Translate இப்போது தமிழை ஆதரிக்கிறது\n\n3. தமிழ் உரை-பேச்சு (TTS):\n• தமிழ் உரையை செயற்கை குரலில் வாசிக்கும் அமைப்புகள்\n• பார்வை இழந்தவர்களுக்கு மதிப்பமிக்கது\n\n4. தமிழ் பேச்சு அங்கீகாரம்:\n• பேசப்படும் தமிழை உரையாக மாற்றும் அமைப்புகள்\n• Google Voice மற்றும் Siri இப்போது தமிழ் பேச்சு உள்ளீட்டை ஆதரிக்கின்றன\n\n5. தமிழ் OCR:\n• தமிழ் உரையின் படங்களை டிஜிட்டல் உரையாக மாற்றும் மென்பொருள்\n• பழைய தமிழ் கையெழுத்துப் பிரதிகள் மற்றும் புத்தகங்களை டிஜிட்டல் வடிவாக்குவதற்கு முக்கியம்\n\n6. சொற்குவை திட்டம்:\n• மொழியியல் ஆராய்ச்சிக்காக பெரிய தமிழ் நூல் தொகுப்பு\n• NLP மாதிரிகள் மற்றும் AI அமைப்புகளுக்கு பயிற்சி அளிக்கவும் வழிவகை செய்கிறது\n\nV. மின்கல்வி மற்றும் தமிழ் கல்வி தொழில்நுட்பம்:\n• TIVA ஆன்லைன் தமிழ் மொழி படிப்புகள் – ஆரம்ப, இடைநிலை மற்றும் மேம்பட்ட நிலைகள்\n• தமிழ்நாடு பள்ளி பாடப்புத்தகங்கள் PDF வடிவில் கிடைக்கின்றன\n• தமிழ் விக்கிபீடியா – 150,000+ கட்டுரைகள்\n• தமிழ் கலப்பூக்கள் மற்றும் சமூக ஊடகங்களில் தமிழ்\n\nVI. தமிழ் டிஜிட்டல் பாரம்பரிய பாதுகாப்பு:\n• திட்டம் மதுரை – அரிய தமிழ் புத்தகங்கள் மற்றும் ஓலைச்சுவடிகளை டிஜிட்டல் வடிவாக்குகிறது\n• தமிழ் டிஜிட்டல் நூலகம் – 100,000+ தமிழ் படைப்புகள் டிஜிட்டல் வடிவாக்கப்பட்டன\n\nVII. மீதமிருக்கும் சவால்கள்:\n• AI மாதிரிகளுக்கு போதுமான தமிழ் பயிற்சி தரவு இல்லாதது\n• பேச்சு மற்றும் எழுத்து தமிழுக்கிடையே வேறுபாடு\n• பழைய அச்சிடப்பட்ட நூல்களுக்கு சிறந்த OCR தேவை\n\nமுடிவுரை:\nகணித்தமிழின் வளர்ச்சி குறியாக்க ஒத்திசைவின்மையிலிருந்து யுனிகோட் தரப்படுத்தல் வரை, நோக்க திரட்டு உரை காட்சிகளிலிருந்து நுட்பமான AI-ஆல் இயக்கப்படும் தமிழ் மொழி கருவிகள் வரை ஒரு குறிப்பிடத்தக்க பயணமாகும். அரசு நிறுவனங்கள், ஆராய்ச்சி பல்கலைக்கழகங்கள் மற்றும் உலகளாவிய தமிழ் சமூகங்களின் முயற்சியால் தமிழ் இப்போது டிஜிட்டல் உலகில் முழுமையாக பங்கேற்கிறது.\n\nமுக்கிய சொற்கள்: கணித்தமிழ், யுனிகோட், TIVA, NLP, இயந்திர மொழிபெயர்ப்பு, தமிழ் பேச்சு அங்கீகாரம், OCR, சொற்குவை, தமிழ் விக்கிபீடியா, திட்டம் மதுரை",
    "keywordsEnglish": ["Kanithamizh", "Unicode", "TIVA", "NLP", "machine translation", "Tamil speech recognition", "OCR", "Tamil corpus", "Sorkuvai", "Tamil Wikipedia"],
    "keywordsTamil": ["கணித்தமிழ்", "யுனிகோட்", "TIVA", "NLP", "இயந்திர மொழிபெயர்ப்பு", "தமிழ் பேச்சு அங்கீகாரம்", "OCR", "சொற்குவை", "தமிழ் விக்கிபீடியா"]
  },
  {
    "unit": "Unit V",
    "qNo": 17,
    "marks": 16,
    "questionEnglish": "Explain about e-books.",
    "questionTamil": "மின்னூல்கள் பற்றி விரிந்து எழுதுக.",
    "answerEnglish": "Introduction:\nAn e-book (மின்னூல் – Electronic Book) is a digital version of a book that can be read on electronic devices such as computers, tablets, smartphones, e-readers (like Kindle), and other digital platforms. E-books represent a revolutionary shift in how knowledge is stored, accessed, and distributed. For Tamil language and literature, e-books have become a critical tool for preservation, education, and cultural promotion in the digital age.\n\nI. Definition and Nature of E-Books:\n• Digital files containing textual content (and often images, audio, video links)\n• Can be read on multiple devices without physical storage\n• Available in various formats: PDF, EPUB, MOBI, HTML, TXT\n• May be interactive (hyperlinks, search functions, annotations)\n• Can be distributed globally at near-zero cost\n\nII. History and Development of E-Books:\n\nGlobal:\n• 1971: Project Gutenberg – first digital book initiative; began digitizing public domain texts\n• 1990s: CD-ROM based e-books\n• 1998: First dedicated e-reader devices\n• 2007: Amazon Kindle – mass popularization of e-readers\n• 2010: iPad and tablet computers made e-books widely accessible\n• Today: Billions of e-books available globally\n\nTamil E-Books:\n• Late 1990s: Early Tamil text files shared on internet (HTML format)\n• 2000s: Project Madurai (திட்டம் மதுரை) – pioneering Tamil e-book project\n• Tamil Virtual Academy (TIVA) – major Tamil e-book repository\n• Presently: Thousands of Tamil e-books available through multiple platforms\n\nIII. Types of Tamil E-Books Available:\n\n1. Ancient and Classical Tamil Literature:\n• Sangam poetry collections: Akananuru, Purananuru, Natrinai, Kalithogai\n• Epic literature: Silappadikaram, Manimekalai, Kambaramayanam\n• Medieval devotional poetry: Tevaram, Tiruvachakam\n• Grammatical works: Tolkappiyam, Nannool\n• Available free through Project Madurai and TIVA\n\n2. Modern Tamil Literature:\n• Novels by major Tamil authors: Akilan, Jayakanthan, Ashokamitran, Jeyamohan\n• Short story collections\n• Poetry by contemporary poets\n• Available through publishers' websites and e-book stores\n\n3. Educational E-Books:\n• Tamil Nadu school textbooks (Classes 1–12) as free PDF e-books\n• University textbooks in Tamil\n• Competitive exam preparation guides\n• Tamil grammar and language learning books\n\n4. Reference E-Books:\n• Tamil-English dictionaries (University of Madras Tamil Lexicon)\n• Encyclopedias\n• Historical and cultural reference works\n\n5. Religious Texts:\n• Thirukural (திருக்குறள்) with commentary\n• Bible, Quran in Tamil\n• Temple mahathiyam (sacred texts) digitized\n\nIV. Platforms and Sources for Tamil E-Books:\n\n1. Project Madurai (திட்டம் மதுரை – www.projectmadurai.org):\n• Non-profit volunteer initiative\n• Digitized over 1,000 rare and out-of-print Tamil works\n• All books freely downloadable in Unicode Tamil\n• Focus on classical literature and cultural heritage\n\n2. Tamil Virtual Academy (TIVA – www.tamilvu.org):\n• Government of Tamil Nadu initiative\n• E-library with thousands of Tamil texts\n• Includes ancient literature, dictionaries, and learning materials\n\n3. Tamil Digital Library (www.tamildigitallibrary.in):\n• Large digital archive of Tamil works\n• Books, manuscripts, journals\n• Some free; some require registration\n\n4. Wikisource Tamil (ta.wikisource.org):\n• Free, community-maintained online library\n• Public domain Tamil texts\n\n5. Commercial E-Book Platforms:\n• Amazon Kindle – Tamil e-books available\n• Notionpress, Pustaka (Indian e-book publishers)\n• Saraswati Stores, Kalachuvadu digital offerings\n\nV. Reading Devices and Software:\n\nHardware:\n• E-ink readers: Kindle, Kobo, Nook\n• Tablets: iPad, Android tablets\n• Smartphones with Tamil font support\n• Laptops and computers\n\nSoftware/Apps:\n• Adobe Reader – for PDF e-books\n• Kindle app – for MOBI/EPUB format\n• Google Play Books\n• Tamil-specific apps: Keetru digital, Tamil e-books apps\n\nVI. Advantages of Tamil E-Books:\n\n1. Preservation:\n• Ancient manuscripts and rare books preserved digitally before physical decay\n• Digital copies stored in multiple locations prevent total loss\n\n2. Accessibility:\n• Available 24/7 from anywhere in the world\n• Tamil diaspora communities worldwide access Tamil literature\n• No need to travel to libraries; immediate download\n\n3. Cost:\n• Many Tamil e-books are free (especially classical literature)\n• E-books cheaper than physical books when priced\n\n4. Search and Navigation:\n• Full-text search within books\n• Hyperlinked glossaries and indices\n• Easy navigation by chapter and page\n\n5. Font Size and Accessibility:\n• Adjustable font size helps elderly readers and those with visual impairments\n• Text-to-speech compatibility\n\n6. Environmental Benefits:\n• No paper; no printing; reduced carbon footprint\n\n7. Portability:\n• Thousands of books on a single device\n\nVII. Challenges of Tamil E-Books:\n• Older Tamil fonts (pre-Unicode) difficult to read on modern devices\n• Copyright restrictions on modern Tamil literature\n• Digital divide — not all Tamil readers have devices or internet\n• Quality control in digitization (OCR errors in scanned books)\n• Piracy of copyrighted Tamil e-books\n\nVIII. Role of E-Books in Tamil Education:\n• Tamil Nadu schools distributing digital textbooks\n• Tamil college students accessing reference books online\n• Tamil language learning through e-books for diaspora children\n• Teachers creating custom digital lesson books (e-book format)\n• TIVA's e-learning integrated with e-book resources\n\nIX. Future of Tamil E-Books:\n• Interactive e-books with audio, video, and animation\n• AI-powered e-books that adapt to reader's level\n• Tamil audiobooks growing (text-to-speech)\n• E-book integration with Tamil search engines\n• Blockchain-based digital rights management for copyrighted Tamil content\n\nConclusion:\nTamil e-books have transformed from experimental digital text files in the 1990s to a mature, diverse, and widely accessible digital publishing ecosystem today. Through initiatives like Project Madurai, TIVA, and Tamil Digital Library, millions of Tamil readers worldwide can access their literary heritage. E-books are not merely a technological convenience — for Tamil, they represent a vital strategy for language preservation and cultural continuity in the digital age.\n\nKeywords: e-book, digital library, Project Madurai, TIVA, Tamil Digital Library, Wikisource, Kindle, PDF, EPUB, classical literature, preservation",
    "answerTamil": "அறிமுகம்:\nமின்னூல் (Electronic Book) என்பது கணினிகள், டேப்லெட்கள், ஸ்மார்ட்போன்கள், மின் வாசிப்பாளர்கள் (Kindle போன்றவை) மற்றும் பிற டிஜிட்டல் தளங்களில் படிக்கக்கூடிய ஒரு புத்தகத்தின் டிஜிட்டல் பதிப்பாகும். தமிழ் மொழி மற்றும் இலக்கியத்திற்கு மின்னூல்கள் டிஜிட்டல் யுகத்தில் பாதுகாப்பு, கல்வி மற்றும் கலாச்சார மேம்பாட்டிற்கான முக்கியமான கருவியாக மாறியுள்ளன.\n\nI. மின்னூலின் வரையறை மற்றும் தன்மை:\n• உரை (மற்றும் பெரும்பாலும் படங்கள், ஒலி, காணொலி இணைப்புகள்) கொண்ட டிஜிட்டல் கோப்புகள்\n• பல வடிவங்களில் கிடைக்கின்றன: PDF, EPUB, MOBI, HTML, TXT\n• கிட்டத்தட்ட பூஜ்ய செலவில் உலகளாவிய வகையில் விநியோகிக்கப்படலாம்\n\nII. மின்னூலின் வரலாறு மற்றும் வளர்ச்சி:\n\nஉலகளாவிய:\n• 1971: திட்டம் குட்டன்பர்க் – முதல் டிஜிட்டல் புத்தக முயற்சி\n• 2007: Amazon Kindle – மின் வாசிப்பாளர்களை பரவலாக பிரபலப்படுத்தியது\n\nதமிழ் மின்னூல்கள்:\n• 1990கள் இறுதி: இணையத்தில் பகிரப்பட்ட ஆரம்பகால தமிழ் உரை கோப்புகள்\n• 2000களில்: திட்டம் மதுரை – முன்னோடி தமிழ் மின்னூல் திட்டம்\n• தமிழ் இணையக் கல்விக் கழகம் (TIVA) – முக்கிய தமிழ் மின்னூல் களஞ்சியம்\n\nIII. கிடைக்கும் தமிழ் மின்னூல்களின் வகைகள்:\n\n1. பண்டைய மற்றும் கிளாசிக் தமிழ் இலக்கியம்:\n• சங்க கவிதை தொகுப்புகள்: அகநானூறு, புறநானூறு, நற்றிணை\n• காப்பிய இலக்கியம்: சிலப்பதிகாரம், மணிமேகலை, கம்பராமாயணம்\n• இடைக்கால பக்தி கவிதை: தேவாரம், திருவாசகம்\n• திட்டம் மதுரை மற்றும் TIVA மூலம் இலவசமாக கிடைக்கின்றன\n\n2. நவீன தமிழ் இலக்கியம்:\n• முக்கிய தமிழ் ஆசிரியர்களின் நாவல்கள்: அகிலன், ஜெயகாந்தன், அசோகமித்திரன்\n\n3. கல்வி மின்னூல்கள்:\n• தமிழ்நாடு பள்ளி பாடப்புத்தகங்கள் (1-12 வகுப்பு) இலவச PDF மின்னூல்களாக\n\nIV. தமிழ் மின்னூல்களுக்கான தளங்கள் மற்றும் ஆதாரங்கள்:\n\n1. திட்டம் மதுரை (www.projectmadurai.org):\n• இலாப நோக்கமற்ற தன்னார்வ முயற்சி\n• 1,000+ அரிய மற்றும் அச்சிடப்படாத தமிழ் படைப்புகள் டிஜிட்டல் வடிவாக்கப்பட்டன\n• அனைத்து புத்தகங்களும் யுனிகோட் தமிழில் இலவசமாக பதிவிறக்கம் செய்யலாம்\n\n2. தமிழ் இணையக் கல்விக் கழகம் (TIVA):\n• தமிழ்நாடு அரசு முயற்சி\n• ஆயிரக்கணக்கான தமிழ் நூல்களுடன் மின் நூலகம்\n\n3. தமிழ் டிஜிட்டல் நூலகம்:\n• தமிழ் படைப்புகளின் பெரிய டிஜிட்டல் காப்பகம்\n\nV. மின்னூல்களின் நன்மைகள்:\n\n1. பாதுகாப்பு:\n• பண்டைய கையெழுத்துப் பிரதிகள் மற்றும் அரிய புத்தகங்கள் டிஜிட்டல் வடிவில் பாதுகாக்கப்படுகின்றன\n\n2. அணுகல்:\n• உலகில் எங்கிருந்தும் 24/7 கிடைக்கும்\n• உலகெங்கும் வாழும் தமிழ் சமூகங்கள் தமிழ் இலக்கியத்தை அணுகலாம்\n\n3. செலவு:\n• பல தமிழ் மின்னூல்கள் இலவசம் (குறிப்பாக கிளாசிக் இலக்கியம்)\n\n4. தேடல் மற்றும் வழிசெலுத்தல்:\n• புத்தகங்களுக்குள் முழு உரை தேடல்\n• அத்தியாயம் மற்றும் பக்கத்தால் எளிய வழிசெலுத்தல்\n\n5. அணுகல் தன்மை:\n• சரிசெய்யக்கூடிய எழுத்து அளவு முதியவர்களுக்கும் பார்வை குறைபாடு உள்ளவர்களுக்கும் உதவுகிறது\n\nVI. தமிழ் கல்வியில் மின்னூல்களின் பங்கு:\n• தமிழ்நாடு பள்ளிகள் டிஜிட்டல் பாடப்புத்தகங்களை விநியோகிக்கின்றன\n• TIVA-ன் மின்கல்வி மின்னூல் வளங்களுடன் ஒருங்கிணைக்கப்பட்டுள்ளது\n• புலம்பெயர் குழந்தைகளுக்கான தமிழ் மொழி கற்றல்\n\nVII. தமிழ் மின்னூல்களின் சவால்கள்:\n• பழைய தமிழ் எழுத்துருக்கள் (யுனிகோட்டுக்கு முந்தைய) நவீன சாதனங்களில் படிக்க கஷ்டம்\n• நவீன தமிழ் இலக்கியத்தில் பதிப்புரிமை கட்டுப்பாடுகள்\n• டிஜிட்டல் பிளவு — அனைத்து தமிழ் வாசகர்களும் சாதனங்கள் அல்லது இணையம் வைத்திருக்கவில்லை\n\nமுடிவுரை:\nதமிழ் மின்னூல்கள் 1990களில் சோதனை டிஜிட்டல் உரை கோப்புகளிலிருந்து இன்று முதிர்ந்த, பன்முக மற்றும் பரவலாக அணுகக்கூடிய டிஜிட்டல் வெளியீட்டு சூழலாக மாறியுள்ளன. திட்டம் மதுரை, TIVA மற்றும் தமிழ் டிஜிட்டல் நூலகம் போன்ற முயற்சிகள் மூலம் உலகெங்கும் உள்ள மில்லியண் கணக்கான தமிழ் வாசகர்கள் தங்கள் இலக்கிய பாரம்பரியத்தை அணுகலாம். மின்னூல்கள் தொழில்நுட்ப வசதி மட்டுமல்ல — தமிழுக்கு அவை மொழி பாதுகாப்பு மற்றும் கலாச்சார தொடர்ச்சிக்கான முக்கிய உத்தியாகும்.\n\nமுக்கிய சொற்கள்: மின்னூல், டிஜிட்டல் நூலகம், திட்டம் மதுரை, TIVA, தமிழ் டிஜிட்டல் நூலகம், PDF, EPUB, கிளாசிக் இலக்கியம், பாதுகாப்பு",
    "keywordsEnglish": ["e-book", "digital library", "Project Madurai", "TIVA", "Tamil Digital Library", "Kindle", "PDF", "EPUB", "classical literature", "preservation"],
    "keywordsTamil": ["மின்னூல்", "டிஜிட்டல் நூலகம்", "திட்டம் மதுரை", "TIVA", "தமிழ் டிஜிட்டல் நூலகம்", "PDF", "EPUB", "கிளாசிக் இலக்கியம்", "பாதுகாப்பு"]
  },
  {
    "unit": "Unit V",
    "qNo": 18,
    "marks": 16,
    "questionEnglish": "Explain about online dictionaries or e-dictionaries.",
    "questionTamil": "இணைய அகராதி அல்லது மின் அகராதி குறித்து விளக்குக.",
    "answerEnglish": "Introduction:\nAn online dictionary or e-dictionary (மின் அகராதி) is a digital reference tool accessible via the internet that provides word definitions, pronunciations, etymologies, synonyms, antonyms, and usage examples. For Tamil — with its ancient vocabulary spanning over 2,000 years — online dictionaries have become essential tools for language learning, research, translation, and preservation in the digital age.\n\nI. Definition and Features:\n• A database-backed digital reference that provides instant word lookup\n• Available on websites, mobile apps, and built into operating systems\n• Features may include: definitions, etymology, synonyms, usage examples, pronunciation audio, image illustrations\n• Updated continuously, unlike printed dictionaries\n• Multi-lingual capabilities (Tamil-Tamil, Tamil-English, Tamil-Sanskrit)\n\nII. Historical Background of Tamil Dictionaries:\n\nPrinted Tamil Dictionaries:\n• Fabricius Tamil-English Dictionary (1779) – early missionary dictionary\n• University of Madras Tamil Lexicon (1924–1939) – comprehensive 6-volume classical Tamil dictionary; 79,000+ entries\n• H.W. Lakshmi Devi's Tamil-English Dictionary\n\nTransition to Digital:\n• University of Madras Tamil Lexicon digitized in 1990s–2000s\n• Available online at University of Madras and multiple mirror sites\n• TIVA (Tamil Virtual Academy) incorporated digital dictionaries into its platform\n\nIII. Major Tamil Online Dictionaries:\n\n1. University of Madras Tamil Lexicon (Online):\n• Based on the 1924–1939 printed edition\n• Comprehensive classical Tamil dictionary; over 79,000 entries\n• Available at: https://www.tamilvu.org and partner sites\n• Covers ancient Tamil vocabulary; includes citations from classical literature\n\n2. Tamil Wiktionary (ta.wiktionary.org):\n• Part of Wikimedia Foundation's free knowledge projects\n• Collaboratively edited by volunteer community\n• Provides: Tamil word definitions, etymologies, translations into 100+ languages\n• Pronunciation guides using IPA\n• Anyone can add or improve entries\n• Continuously growing Tamil language resource\n\n3. Maduram Online Dictionary (மதுரம் மின் அகராதி):\n• Comprehensive Tamil-Tamil and Tamil-English dictionary\n• Multiple components:\n  - Tamil word definitions in Tamil\n  - Tamil-English translations\n  - Tamil-Sanskrit cross-references\n  - Proverbs (பழமொழி) section\n  - Idioms and phrases (சொற்றொடர்கள்)\n  - Example sentences\n• Available as website and mobile app\n\n4. Agaraadhi.com (அகராதி.com):\n• Popular bilingual Tamil-English online dictionary\n• Simple interface; quick word lookup\n• Mobile-friendly; widely used by students and general public\n\n5. Sabdatharavali (சப்தத்தாரவளி):\n• Classical Tamil dictionary with Sanskrit connections\n• Useful for researchers of classical and devotional Tamil literature\n\n6. Tamil99 Keyboard and Dictionary:\n• Government-standardized keyboard layout with built-in word suggestions\n• Integrated into Tamil computing environment\n\nIV. Special-Purpose Tamil Online Dictionaries:\n\n1. Technical Tamil Dictionary:\n• Specialized vocabulary for science, technology, medicine, law\n• Tamil Nadu Government published technical glossaries\n• CIIL (Central Institute of Indian Languages) technical Tamil dictionaries\n\n2. Sanskrit-Tamil Dictionary:\n• Cross-reference between Sanskrit and Tamil vocabulary\n• Important for classical literature research\n\n3. Dialectal Dictionaries:\n• Sri Lankan Tamil, Brahmana Tamil, regional dialect word collections\n\nV. Features of Tamil Online Dictionaries:\n\n1. Instant Search:\n• Type a word; results appear instantly\n• Fuzzy search for approximate spelling\n• Romanized Tamil input supported\n\n2. Multiple Meanings:\n• One Tamil word often has many meanings; online dictionaries list all\n• Different meanings organized by part of speech (noun, verb, adjective)\n\n3. Etymology:\n• Word origins traced; Sanskrit borrowings identified; Dravidian roots noted\n\n4. Cross-References:\n• Links to synonyms, antonyms, and related words\n\n5. Example Sentences:\n• Contextual usage shown in sentences from classical or modern Tamil\n\n6. Pronunciation:\n• Some dictionaries provide audio pronunciation\n• IPA transcription for phonetic clarity\n\n7. Search History and Bookmarks:\n• Users can save frequently used words\n\nVI. Mobile Dictionary Apps:\n• Tamil Dictionary apps for Android and iOS widely available\n• Popular apps: Tamil Dictionary by Mootham, Aksharamala Tamil Dictionary\n• Google Translate – Tamil translation with dictionary features\n• Microsoft Translator – Tamil language support\n\nVII. Integration with Text Editors:\n• Tamil spell checkers with built-in dictionary suggestions\n• Browser extensions that show Tamil word definitions on hover\n• Microsoft Word Tamil spell-check powered by dictionary database\n\nVIII. Role of Tamil Online Dictionaries in Education:\n• Students lookup meanings instantly while reading Tamil texts\n• Tamil language learners (diaspora, foreign students) use bilingual dictionaries\n• Teachers cite dictionary definitions in lesson plans\n• Researchers verify classical word meanings in literary analysis\n• Translators reference Tamil-English dictionaries for accuracy\n\nIX. Challenges and Issues:\n• Not all classical Tamil words have been digitized\n• Dialectal variations not always captured\n• Some dictionaries not updated with new neologisms and modern technical vocabulary\n• Inconsistent transliteration standards across platforms\n• Accessibility on low-bandwidth internet connections in rural areas\n\nX. Future of Tamil Online Dictionaries:\n• AI-powered contextual definitions (understanding meaning from context)\n• Voice-activated dictionary lookup (say the word; hear the definition)\n• Integration with Tamil NLP for automatic vocabulary suggestion\n• Visual dictionaries with image illustrations\n• Collaborative crowd-sourced continuous improvement\n\nConclusion:\nTamil online dictionaries have democratized access to Tamil vocabulary and linguistic knowledge. From the scholarly University of Madras Tamil Lexicon to the community-maintained Tamil Wiktionary, from the comprehensive Maduram to the user-friendly Agaraadhi, these digital tools serve students, researchers, writers, and Tamil learners worldwide. They are not merely convenience tools — they are guardians of Tamil's vast lexical heritage, making it accessible to every Tamil speaker regardless of geography or background.\n\nKeywords: e-dictionary, Tamil Lexicon, Tamil Wiktionary, Maduram, Agaraadhi, online dictionary, bilingual, Tamil learning, NLP, digital vocabulary",
    "answerTamil": "அறிமுகம்:\nமின் அகராதி (Online Dictionary / e-dictionary) என்பது இணையம் வழியாக அணுகக்கூடிய டிஜிட்டல் குறிப்பு கருவியாகும். சொல் வரையறைகள், உச்சரிப்புகள், சொற்பிறப்பியல், ஒத்த சொற்கள், எதிர்ச்சொற்கள் மற்றும் பயன்பாட்டு எடுத்துக்காட்டுகளை வழங்குகிறது. 2,000 ஆண்டுகளுக்கும் மேலான சொல்வளஞ்சேரியை கொண்ட தமிழுக்கு, ஆன்லைன் அகராதிகள் டிஜிட்டல் யுகத்தில் மொழி கற்றல், ஆராய்ச்சி மற்றும் பாதுகாப்பிற்கான இன்றியமையாத கருவிகளாகிவிட்டன.\n\nI. வரையறை மற்றும் அம்சங்கள்:\n• தரவுத்தள ஆதாரமுடைய டிஜிட்டல் குறிப்பு; உடனடி சொல் தேடல்\n• இணைதளங்கள், மொபைல் ஆப்கள் மற்றும் இயக்க முறைமைகளில் உள்ளமைந்தவை\n• வரையறைகள், சொற்பிறப்பியல், ஒத்த சொற்கள், பயன்பாட்டு எடுத்துக்காட்டுகள், உச்சரிப்பு ஒலி ஆகியவை\n• அச்சிடப்பட்ட அகராதிகளைப் போலல்லாமல் தொடர்ச்சியாக புதுப்பிக்கப்படுகின்றன\n\nII. தமிழ் அகராதிகளின் வரலாற்றுப் பின்னணி:\n\nமுக்கிய அச்சிடப்பட்ட தமிழ் அகராதிகள்:\n• ஃபேப்ரிசியஸ் தமிழ்-ஆங்கிலம் அகராதி (1779)\n• சென்னை பல்கலைக்கழக தமிழ் அகராதி (1924–1939) – 6 தொகுதி, 79,000+ உள்ளீடுகள்\n\nடிஜிட்டலுக்கு மாறுதல்:\n• சென்னை பல்கலைக்கழக தமிழ் அகராதி 1990கள்–2000களில் டிஜிட்டல் வடிவாக்கப்பட்டது\n\nIII. முக்கிய தமிழ் ஆன்லைன் அகராதிகள்:\n\n1. சென்னை பல்கலைக்கழக தமிழ் அகராதி (ஆன்லைன்):\n• 1924–1939 அச்சிட்ட பதிப்பு அடிப்படையில்\n• 79,000+ உள்ளீடுகளுடன் விரிவான கிளாசிக் தமிழ் அகராதி\n• கிளாசிக் இலக்கியத்திலிருந்து மேற்கோள்கள் உள்ளிட்ட பண்டைய தமிழ் சொல்வளஞ்சேரியை உள்ளடக்கியது\n\n2. தமிழ் விக்சனரி:\n• விக்கிமீடியா அறக்கட்டளையின் இலவச அறிவு திட்டங்களின் பகுதி\n• தன்னார்வ சமூகத்தால் கூட்டாக திருத்தப்படுகிறது\n• 100+ மொழிகளில் மொழிபெயர்ப்புகள்; யாரும் உள்ளீடுகளை சேர்க்கலாம் அல்லது மேம்படுத்தலாம்\n\n3. மதுரம் மின் அகராதி:\n• விரிவான தமிழ்-தமிழ் மற்றும் தமிழ்-ஆங்கிலம் அகராதி\n• பல கூறுகள்: தமிழில் வரையறைகள், ஆங்கிலம் மொழிபெயர்ப்புகள், பழமொழிகள் பகுதி, சொற்றொடர்கள், எடுத்துக்காட்டு வாக்கியங்கள்\n• இணைதளம் மற்றும் மொபைல் ஆப் ஆக கிடைக்கிறது\n\n4. அகராதி.com:\n• பிரபலமான இருமொழி தமிழ்-ஆங்கிலம் ஆன்லைன் அகராதி\n• மாணவர்கள் மற்றும் பொது மக்கள் பரவலாக பயன்படுத்துகிறார்கள்\n\nIV. தமிழ் ஆன்லைன் அகராதிகளின் அம்சங்கள்:\n\n1. உடனடி தேடல்:\n• ஒரு சொல்லை தட்டச்சு செய்யுங்கள்; முடிவுகள் உடனடியாக தெரிகின்றன\n• தோராயமான எழுத்துப்பிழைக்கான தேடல் (fuzzy search)\n\n2. பல அர்த்தங்கள்:\n• ஒரு தமிழ் சொல்லுக்கு பல அர்த்தங்கள் இருக்கலாம்; ஆன்லைன் அகராதிகள் எல்லாவற்றையும் பட்டியலிடுகின்றன\n\n3. சொற்பிறப்பியல்:\n• சொல் தோற்றங்கள் கண்டறியப்பட்டன; சமஸ்கிருத கடன்கள் அடையாளம் காணப்பட்டன\n\n4. எடுத்துக்காட்டு வாக்கியங்கள்:\n• கிளாசிக் அல்லது நவீன தமிழிலிருந்து சந்தர்ப்பசார் பயன்பாடு\n\nV. மொபைல் அகராதி ஆப்கள்:\n• Android மற்றும் iOS க்கு தமிழ் அகராதி ஆப்கள் பரவலாக கிடைக்கின்றன\n• Google Translate – அகராதி அம்சங்களுடன் தமிழ் மொழிபெயர்ப்பு\n\nVI. தமிழ் கல்வியில் ஆன்லைன் அகராதிகளின் பங்கு:\n• தமிழ் நூல்களை படிக்கும்போது மாணவர்கள் உடனடியாக அர்த்தங்களை தேடுகிறார்கள்\n• புலம்பெயர் மற்றும் வெளிநாட்டு மாணவர்கள் இருமொழி அகராதிகளை பயன்படுத்துகிறார்கள்\n• மொழிபெயர்ப்பாளர்கள் துல்லியத்திற்காக தமிழ்-ஆங்கிலம் அகராதிகளை குறிப்பிடுகிறார்கள்\n• ஆராய்ச்சியாளர்கள் இலக்கிய பகுப்பாய்வில் கிளாசிக் சொல் அர்த்தங்களை சரிபார்க்கிறார்கள்\n\nVII. சவால்கள்:\n• அனைத்து கிளாசிக் தமிழ் சொற்களும் டிஜிட்டல் வடிவில் இல்லை\n• வட்டார வகைகள் எப்போதும் பதிவாவதில்லை\n• சில அகராதிகள் புதிய தொழில்நுட்ப சொல்வளஞ்சேரியுடன் புதுப்பிக்கப்படவில்லை\n\nமுடிவுரை:\nதமிழ் ஆன்லைன் அகராதிகள் தமிழ் சொல்வளஞ்சேரியை மற்றும் மொழியியல் அறிவை ஜனநாயகப்படுத்தியுள்ளன. சென்னை பல்கலைக்கழக தமிழ் அகராதி முதல் தமிழ் விக்சனரி வரை, விரிவான மதுரம் முதல் பயனர் நட்பு அகராதி.com வரை, இந்த டிஜிட்டல் கருவிகள் உலகெங்கும் மாணவர்கள், ஆராய்ச்சியாளர்கள், எழுத்தாளர்கள் மற்றும் தமிழ் கற்பவர்களுக்கு சேவை செய்கின்றன.\n\nமுக்கிய சொற்கள்: மின் அகராதி, தமிழ் அகராதி, தமிழ் விக்சனரி, மதுரம், அகராதி.com, இருமொழி, டிஜிட்டல் சொல்வளஞ்சேரி",
    "keywordsEnglish": ["e-dictionary", "Tamil Lexicon", "Tamil Wiktionary", "Maduram", "Agaraadhi", "online dictionary", "bilingual", "Tamil learning", "digital vocabulary"],
    "keywordsTamil": ["மின் அகராதி", "தமிழ் அகராதி", "தமிழ் விக்சனரி", "மதுரம்", "அகராதி.com", "இருமொழி", "டிஜிட்டல் சொல்வளஞ்சேரி"]
  },
  {
    "unit": "Unit V",
    "qNo": 19,
    "marks": 16,
    "questionEnglish": "Describe the Sorkuvai Thittam and their objectives.",
    "questionTamil": "சொற்குவைத் திட்டங்களையும் அவற்றின் நோக்கங்களையும் விரிந்து எழுதுக.",
    "answerEnglish": "Introduction:\nSorkuvai Thittam (சொற்குவை திட்டம் – literally 'Word Treasury Project') is a government and academic initiative aimed at creating a comprehensive digital collection (corpus) of Tamil words and texts. A corpus (corpus meaning 'body' in Latin) is a large, structured collection of text or speech used for linguistic research, computational analysis, and language technology development. For Tamil — a classical language with over 2,000 years of documented history — a robust word corpus is essential for enabling modern natural language processing (NLP), artificial intelligence applications, and linguistic scholarship.\n\nI. What is a Sorkuvai (Tamil Corpus)?\n• A systematically organized digital collection of Tamil words, texts, and linguistic data\n• Includes texts from different time periods, genres, and dialects\n• Structured to allow computerized analysis of Tamil language patterns\n• Serves as the foundational dataset for:\n  - Training Tamil AI language models\n  - Developing Tamil NLP tools\n  - Lexicographic research (dictionary creation)\n  - Linguistic research and documentation\n\nII. Historical Background:\n• Traditional Tamil literary collections (anthologies like Purananuru, Akananuru) were the precursors of corpus thinking\n• Modern corpus linguistics applied to Tamil began in the late 1990s\n• Tamil Virtual Academy (TIVA) initiated systematic digitization of Tamil texts\n• Government of Tamil Nadu and central government (TDIL programme) funded corpus development projects\n\nIII. Key Institutions Involved in Tamil Corpus Development:\n\n1. Tamil Virtual Academy (TIVA):\n• Digitized thousands of classical Tamil texts\n• Created searchable digital Tamil text database\n• Corpus available for research use\n\n2. AU-KBC Research Centre (Anna University, Chennai):\n• Developed Tamil morphological analyser\n• Created part-of-speech tagged Tamil corpora\n• Speech corpus development for Tamil ASR (Automatic Speech Recognition)\n\n3. Technology Development for Indian Languages (TDIL):\n• Central Government initiative under Ministry of Electronics and IT\n• Funded multiple Tamil corpus projects\n• Created parallel Tamil-English corpus for machine translation research\n\n4. Central Institute of Indian Languages (CIIL), Mysore:\n• Developed multi-lingual Indian language corpus including Tamil\n• Comparative linguistic research\n\n5. IIT Madras:\n• Tamil NLP research using corpus tools\n• Contributed to Tamil treebank and syntactic corpus\n\nIV. Primary Objectives of Sorkuvai Thittam:\n\nObjective 1 – Vocabulary Documentation:\n• Collect, archive, and digitize Tamil vocabulary from all time periods:\n  - Classical period (Sangam era: 300 BCE–300 CE)\n  - Medieval period (9th–17th century CE)\n  - Colonial period (18th–19th century CE)\n  - Modern period (20th–21st century)\n• Include archaic words from classical literature\n• Document regional dialects and colloquial speech\n\nObjective 2 – Building a Digital Corpus:\n• Create a large, searchable digital database of Tamil texts\n• Include tagged and annotated texts for linguistic analysis\n• Develop balanced corpus (representing different genres: literature, news, science, legal)\n• Create sub-corpora for specific research needs\n\nObjective 3 – Support Tamil NLP (Natural Language Processing):\n• Provide training data for Tamil language AI models\n• Enable:\n  - Tamil morphological analysis\n  - Part-of-speech tagging\n  - Named entity recognition\n  - Dependency parsing (syntactic analysis)\n  - Sentiment analysis\n  - Text classification\n\nObjective 4 – Machine Translation Support:\n• Tamil-English parallel corpus for developing better machine translation\n• Enable Google Translate, DeepL, and other MT systems to improve Tamil accuracy\n• Cross-language information retrieval\n\nObjective 5 – Preservation of Rare and Archaic Tamil:\n• Prevent rare Tamil words from disappearing into obscurity\n• Archive dialect words before elderly native speakers pass away\n• Document Sangam-period vocabulary with contextual citations\n\nObjective 6 – Lexicographic Development:\n• Provide evidence base for new Tamil dictionary projects\n• Update existing dictionaries with corpus-verified contemporary usage\n• Create frequency lists showing most-used Tamil words\n\nObjective 7 – Tamil Language Teaching and Learning:\n• Corpus-based Tamil grammar teaching\n• Real usage examples for Tamil learners\n• Frequency-based vocabulary lists for efficient learning\n\nObjective 8 – Scientific Tamil (அறிவியல் தமிழ் – Ariviyal Tamil):\n• Document Tamil technical vocabulary in science, technology, law, medicine\n• Create specialized technical Tamil corpora\n• Support creation of Tamil technical glossaries\n\nV. Types of Tamil Corpora Developed:\n\n1. Literary Corpus:\n• Classical Sangam texts\n• Medieval devotional literature (Tevaram, Divya Prabandham)\n• Modern Tamil novels, short stories, poetry\n\n2. News Corpus:\n• Tamil newspaper texts (Dinamani, Dinamalar, Hindu Tamil)\n• Useful for contemporary vocabulary and style analysis\n\n3. Spoken Tamil Corpus:\n• Transcripts of spoken Tamil in various dialects\n• Used for speech recognition training\n\n4. Parallel Corpus (Tamil-English):\n• Aligned Tamil and English texts\n• Essential for machine translation research\n\n5. Annotated Corpus:\n• Part-of-speech tagged, dependency-parsed texts\n• Used for advanced NLP model training\n\nVI. Tamil Treebank:\n• A syntactically annotated corpus where each sentence has a tree structure showing grammatical relationships\n• Developed by IIT Madras and AU-KBC\n• Critical for Tamil dependency parsing and NLP\n\nVII. Challenges in Tamil Corpus Development:\n\n1. Diglossia (language divide):\n• Written formal Tamil (ezhuthu Tamil) differs significantly from spoken colloquial Tamil (pEchu Tamil)\n• Need separate corpora for each variety\n\n2. Script Encoding:\n• Legacy texts in non-Unicode encodings need conversion\n• OCR errors in digitized texts need correction\n\n3. Copyright:\n• Modern Tamil texts copyrighted; difficult to include in open corpora\n• Open licenses needed for research use\n\n4. Size:\n• Tamil corpus still smaller than major world language corpora (English, Chinese)\n• Need for larger, more diverse corpus\n\nVIII. Applications of Tamil Corpus:\n• Training ChatGPT-like Tamil AI language models\n• Improving Google Translate Tamil accuracy\n• Developing Tamil spell checkers\n• Tamil text classification (spam detection, sentiment analysis)\n• Tamil educational tools and learning apps\n\nIX. Connection to Tamil Digital Libraries and E-Books:\n• Texts digitized by Project Madurai and TIVA feed into corpus development\n• Reciprocal relationship: corpus enables better digital tools for libraries\n\nConclusion:\nSorkuvai Thittam is one of the most important ongoing projects for Tamil's survival and growth in the digital era. By systematically collecting, organizing, annotating, and making available the vast wealth of Tamil vocabulary and text, it creates the essential foundation for Tamil AI, NLP, machine translation, and linguistic research. Continued investment in Tamil corpus development is not just a linguistic project — it is a cultural mission to ensure that Tamil, one of the world's great classical languages, thrives in the 21st century digital world.\n\nKeywords: Sorkuvai, Tamil corpus, NLP, machine translation, TIVA, AU-KBC, TDIL, morphological analysis, part-of-speech tagging, parallel corpus, archaic vocabulary",
    "answerTamil": "அறிமுகம்:\nசொற்குவை திட்டம் என்பது தமிழ் சொற்கள் மற்றும் நூல்களின் விரிவான டிஜிட்டல் தொகுப்பை (corpus) உருவாக்குவதை நோக்கமாக கொண்ட அரசு மற்றும் கல்வி முயற்சியாகும். ஒரு corpus என்பது மொழியியல் ஆராய்ச்சி, கணினி பகுப்பாய்வு மற்றும் மொழி தொழில்நுட்ப மேம்பாட்டிற்காக பயன்படுத்தப்படும் பெரிய, கட்டமைக்கப்பட்ட உரை அல்லது பேச்சு தொகுப்பாகும்.\n\nI. சொற்குவை என்றால் என்ன?\n• முறையாக ஒழுங்கமைக்கப்பட்ட தமிழ் சொற்கள், நூல்கள் மற்றும் மொழியியல் தரவின் டிஜிட்டல் தொகுப்பு\n• வெவ்வேறு காலகட்டங்கள், வகைகள் மற்றும் வட்டாரங்களிலிருந்து நூல்களை உள்ளடக்குகிறது\n• தமிழ் AI மொழி மாதிரிகளுக்கு பயிற்சி தரவு வழங்குகிறது\n• தமிழ் NLP கருவிகள் மேம்படுத்துதலுக்கு\n\nII. சொற்குவை திட்டத்தில் ஈடுபட்ட முக்கிய நிறுவனங்கள்:\n\n1. தமிழ் இணையக் கல்விக் கழகம் (TIVA):\n• ஆயிரக்கணக்கான கிளாசிக் தமிழ் நூல்களை டிஜிட்டல் வடிவாக்கியது\n• தேடக்கூடிய டிஜிட்டல் தமிழ் உரை தரவுத்தளம் உருவாக்கியது\n\n2. AU-KBC ஆராய்ச்சி மையம் (அண்ணா பல்கலைக்கழகம்):\n• தமிழ் உருபன் பகுப்பாளி உருவாக்கியது\n• பேச்சு பகுதி குறிப்பிடப்பட்ட தமிழ் corpus உருவாக்கியது\n• தமிழ் தானியங்கி பேச்சு அங்கீகாரத்திற்கு பேச்சு corpus\n\n3. TDIL – இந்திய மொழிகளுக்கான தொழில்நுட்ப மேம்பாடு:\n• மத்திய அரசு முயற்சி\n• பல தமிழ் corpus திட்டங்களுக்கு நிதியுதவி\n\nIII. சொற்குவை திட்டத்தின் முதன்மை நோக்கங்கள்:\n\nநோக்கம் 1 – சொல்வளஞ்சேரி ஆவணப்படுத்தல்:\n• அனைத்து காலகட்டங்களிலிருந்தும் தமிழ் சொல்வளஞ்சேரியை சேகரித்து, காப்பகமாக்கி, டிஜிட்டல் வடிவாக்குதல்\n• பண்டைய நூல்களிலிருந்து அரிய சொற்களை உள்ளடக்குதல்\n• வட்டார வழக்குகள் மற்றும் பேச்சு வழக்கை ஆவணப்படுத்துதல்\n\nநோக்கம் 2 – டிஜிட்டல் corpus கட்டமைத்தல்:\n• தமிழ் நூல்களின் பெரிய, தேடக்கூடிய டிஜிட்டல் தரவுத்தளம் உருவாக்குதல்\n• குறிப்பிடப்பட்ட மற்றும் சீர்திருத்தப்பட்ட நூல்களை மொழியியல் பகுப்பாய்விற்கு உள்ளடக்குதல்\n\nநோக்கம் 3 – தமிழ் NLP ஆதரவு:\n• தமிழ் AI மொழி மாதிரிகளுக்கு பயிற்சி தரவு வழங்குதல்\n• தமிழ் உருபன் பகுப்பாய்வு, பேச்சு பகுதி குறிப்பிடல், உணர்வு பகுப்பாய்வு\n\nநோக்கம் 4 – இயந்திர மொழிபெயர்ப்பு ஆதரவு:\n• சிறந்த இயந்திர மொழிபெயர்ப்பு மேம்பாட்டிற்கு தமிழ்-ஆங்கிலம் இணை corpus\n\nநோக்கம் 5 – அரிய மற்றும் பழமையான தமிழ் பாதுகாப்பு:\n• அரிய தமிழ் சொற்கள் மறைந்துவிடுவதை தடுத்தல்\n• முதியவர்கள் இறப்பதற்கு முன் வட்டார சொற்களை காப்பகமாக்குதல்\n\nநோக்கம் 6 – அகராதியியல் மேம்பாடு:\n• புதிய தமிழ் அகராதி திட்டங்களுக்கு சான்று அடிப்படை வழங்குதல்\n• corpus-சரிபார்க்கப்பட்ட சமகால பயன்பாட்டுடன் ஏற்கனவே உள்ள அகராதிகளை புதுப்பித்தல்\n\nIV. உருவாக்கப்பட்ட தமிழ் corpus வகைகள்:\n\n1. இலக்கிய corpus:\n• கிளாசிக் சங்க நூல்கள்; இடைக்கால பக்தி இலக்கியம்; நவீன தமிழ் நாவல்கள்\n\n2. செய்தி corpus:\n• தமிழ் செய்தித்தாள் நூல்கள்; சமகால சொல்வளஞ்சேரி பகுப்பாய்விற்கு\n\n3. பேசப்படும் தமிழ் corpus:\n• பேசப்படும் தமிழின் பல வட்டாரங்களில் கோப்புகள்; பேச்சு அங்கீகார பயிற்சிக்கு\n\n4. இணை corpus (தமிழ்-ஆங்கிலம்):\n• சீரமைக்கப்பட்ட தமிழ் மற்றும் ஆங்கில நூல்கள்; இயந்திர மொழிபெயர்ப்பு ஆராய்ச்சிக்கு இன்றியமையாதது\n\nV. சவால்கள்:\n1. எழுத்து தமிழுக்கும் பேச்சு தமிழுக்கும் இடையிலான வேறுபாடு\n2. யுனிகோட் அல்லாத குறியாக்கங்களில் பழைய நூல்கள்\n3. நவீன தமிழ் நூல்களில் பதிப்புரிமை கட்டுப்பாடுகள்\n4. முக்கிய உலக மொழி corpus-களுடன் ஒப்பிடும்போது சிறிய corpus அளவு\n\nVI. தமிழ் corpus-இன் பயன்பாடுகள்:\n• ChatGPT போன்ற தமிழ் AI மொழி மாதிரிகள் பயிற்சி\n• Google Translate தமிழ் துல்லியம் மேம்படுத்தல்\n• தமிழ் எழுத்துப்பிழை திருத்திகள் மேம்படுத்தல்\n• தமிழ் கல்வி கருவிகள் மற்றும் கற்றல் ஆப்கள்\n\nமுடிவுரை:\nசொற்குவை திட்டம் டிஜிட்டல் யுகத்தில் தமிழின் தழைத்தோங்குதல் மற்றும் வளர்ச்சிக்காக நடந்துகொண்டிருக்கும் மிக முக்கியமான திட்டங்களில் ஒன்றாகும். தமிழ் சொல்வளஞ்சேரி மற்றும் உரையை முறையாக சேகரித்து, ஒழுங்கமைத்து, சீர்திருத்தி கிடைக்கச்செய்வதன் மூலம், தமிழ் AI, NLP, இயந்திர மொழிபெயர்ப்பு மற்றும் மொழியியல் ஆராய்ச்சிக்கு இன்றியமையாத அடிப்படையை உருவாக்குகிறது.\n\nமுக்கிய சொற்கள்: சொற்குவை, தமிழ் corpus, NLP, இயந்திர மொழிபெயர்ப்பு, TIVA, AU-KBC, TDIL, உருபன் பகுப்பாய்வு, பேச்சு பகுதி குறிப்பிடல், இணை corpus",
    "keywordsEnglish": ["Sorkuvai", "Tamil corpus", "NLP", "machine translation", "TIVA", "AU-KBC", "TDIL", "morphological analysis", "part-of-speech tagging", "parallel corpus"],
    "keywordsTamil": ["சொற்குவை", "தமிழ் corpus", "NLP", "இயந்திர மொழிபெயர்ப்பு", "TIVA", "AU-KBC", "TDIL", "உருபன் பகுப்பாய்வு", "இணை corpus"]
  },
  {
    "unit": "Unit V",
    "qNo": 20,
    "marks": 16,
    "questionEnglish": "Write an essay on the topic of Scientific Tamil.",
    "questionTamil": "அறிவியல் தமிழ் என்னும் தலைப்பில் கட்டுரை எழுதுக.",
    "answerEnglish": "Introduction:\nScientific Tamil (அறிவியல் தமிழ் – Ariviyal Tamil) refers to the systematic use and development of Tamil language for expressing scientific, technological, and technical knowledge. It encompasses the creation of Tamil technical terminology, scientific writing, technical education in Tamil, and the cultivation of a scientific temperament expressed through the Tamil language. The challenge of Scientific Tamil lies in balancing the purity and classical richness of the language with the rapidly evolving needs of modern science and technology.\n\nI. Historical Background of Scientific Tamil:\n\nAncient Scientific Tamil:\nAncient Tamils possessed remarkable scientific knowledge expressed in Tamil:\n• Astronomy (வானவியல்): Purananooru mentions star formations; ancient Tamils named stars, planets, and tracked astronomical cycles\n• Mathematics (கணிதம்): The word 'Kanit/Ganit' for mathematics is related to Tamil; ancient Tamil mathematical texts exist\n• Medicine (மருத்துவம்): Siddha medicine (சித்த மருத்துவம்) – entirely Tamil-language medical tradition; treatises like Agasthiyar Vaithyam\n• Agriculture (வேளாண்மை): Sophisticated agricultural knowledge documented in Sangam literature\n• Architecture (கட்டடக்கலை): Temple building manuals (agama texts) contain precise architectural science\n• Metallurgy (உலோகவியல்): Iron and bronze technology knowledge; Wootz steel\n• Shipbuilding (கப்பல் கட்டுமானம்): Maritime technology described in Sangam texts\n\nMedieval Scientific Tamil:\n• Siddha (சித்தர்) literature: Thirumandhiram, Agathiyar texts contain chemistry (alchemy – rasavatham), medicine, and philosophy\n• Tamil astronomical texts\n• Tamil mathematical works\n\nColonial Period Challenge:\n• British colonialism established English as the language of science and administration\n• Tamil science education largely eliminated\n• Tamil technical vocabulary underdeveloped during this period\n\nII. Need for Scientific Tamil:\n\n1. Education in Mother Tongue:\n• Research consistently shows students understand concepts better in their mother tongue\n• Tamil medium science education requires robust Tamil scientific vocabulary\n• First-generation students from non-English backgrounds face disadvantage in English-only science education\n\n2. Democratizing Knowledge:\n• Science in Tamil makes knowledge accessible to ordinary Tamil citizens\n• Scientific awareness among rural and less-educated populations requires Tamil medium\n\n3. Cultural Identity:\n• Tamil has an unbroken civilizational continuity; science in Tamil reinforces that knowledge belongs to all\n• Prevents the perception that science is 'foreign' or 'English-only'\n\n4. Language Preservation:\n• Using Tamil for science keeps the language vital and current\n• Creates new vocabulary, ensuring Tamil remains a living, growing language\n\nIII. Development of Tamil Technical Vocabulary:\n\nPrinciples of Tamil Term Formation:\n1. Pure Tamil words (தனித்தமிழ் சொற்கள்):\n   • Using native Tamil roots to create new technical terms\n   • Example: வேதியியல் (Chemistry – from வேதி = transformation), உயிரியல் (Biology – from உயிர் = life)\n\n2. Transliteration (ஒலிபெயர்ப்பு):\n   • Adapting foreign technical terms with Tamil phonology\n   • Example: ஆக்ஸிஜன் (Oxygen), நைட்ரஜன் (Nitrogen)\n\n3. Semantic borrowing:\n   • Giving Tamil words new technical meanings\n   • Example: விசை (force), ஆற்றல் (energy)\n\nKey Tamil Technical Terms (Examples):\n• Chemistry: வேதியியல், மூலகம் (element), சேர்மம் (compound), கலவை (mixture)\n• Physics: இயற்பியல், விசை (force), ஆற்றல் (energy), வெப்பம் (heat), ஒளி (light)\n• Biology: உயிரியல், செல் (cell), நுண்ணுயிர் (microbe), கலப்பினம் (hybrid)\n• Mathematics: கணிதம், கோணம் (angle), பரப்பளவு (area), கூட்டல் (addition)\n• Technology: தொழில்நுட்பம், மென்பொருள் (software), கணினி (computer)\n\nIV. Institutions Promoting Scientific Tamil:\n\n1. Tamil Nadu Government:\n• Tamil school textbooks have Tamil scientific terminology\n• Tamil medium schools use translated science books\n• State Council of Educational Research and Training (SCERT) – develops Tamil medium science curriculum\n\n2. Tamil Nadu Textbook Corporation:\n• Publishes all school textbooks in Tamil with developed scientific vocabulary\n• Tamil translation of science, mathematics, and social science books\n\n3. Tamil Virtual Academy (TIVA):\n• Online science content in Tamil\n• Tamil technical glossaries available\n\n4. Technology Development for Indian Languages (TDIL):\n• Government of India project creating Tamil technical terminology databases\n\n5. Universities:\n• Madurai Kamaraj University, Bharathidasan University – Tamil medium departments\n• Tamil Studies departments at various universities conduct research in Scientific Tamil\n\nV. Scientific Tamil in Mass Media:\n\n1. Tamil Science Magazines:\n• Vigyan Pragathi Tamil edition\n• Tamil Science Review (Ariviyal Tamil)\n• National Geographic Tamil edition (digital)\n\n2. Tamil Science Websites and Blogs:\n• Science-focused Tamil websites explaining concepts in Tamil\n• Tamil science YouTube channels with millions of subscribers\n\n3. Tamil in Technology Media:\n• Technology news in Tamil (Vikatan Tech, Dinamalar Tech)\n• Tamil-language programming tutorials on YouTube\n\nVI. Scientific Tamil in Education:\n• Tamil Nadu – all school subjects available in Tamil medium\n• Tamil medium competitive examination preparation\n• Medical and engineering entrance exam preparation guides in Tamil\n• Siddha and Ayurveda medicine still taught in Tamil classical tradition\n• IIT Madras, Anna University – some Tamil medium engineering education\n\nVII. Challenges in Scientific Tamil:\n\n1. Vocabulary Gaps:\n• New scientific discoveries constantly create new terms needing Tamil equivalents\n• Some fields (computer science, genetics, nanotechnology) have huge vocabulary deficits in Tamil\n\n2. Consistency:\n• Different institutions use different Tamil terms for the same concept\n• Need for standardization\n\n3. Perception:\n• Some students and professionals perceive Tamil as insufficient for 'modern' science\n• Internalized preference for English technical vocabulary\n\n4. Higher Education:\n• Most Tamil Nadu university courses still primarily English-medium\n• Research papers overwhelmingly in English\n\n5. Publishing:\n• Scientific publishing in Tamil is limited; peer-reviewed Tamil journals rare\n\nVIII. Future of Scientific Tamil:\n• AI-powered Tamil science writing assistants\n• Tamil NLP tools for automatic scientific term suggestion\n• Open-access Tamil science textbooks for all levels\n• Tamil Wikipedia science articles – currently active and growing\n• International Tamil science conferences\n• Tamil-medium medical, engineering, and law education\n\nIX. Siddha Medicine – Living Example of Scientific Tamil:\n• Siddha medicine (சித்த மருத்துவம்) remains a completely Tamil-medium scientific tradition\n• Siddha medical colleges teach entirely in Tamil\n• Ancient Siddha texts: Agathiyar, Thirumoolar, Yugi contain chemistry, anatomy, pharmacology in Tamil\n• Government Siddha hospitals across Tamil Nadu practice evidence-based medicine in Tamil\n• Living proof that science can be fully practiced in Tamil\n\nConclusion:\nScientific Tamil is not an academic exercise — it is a civilizational imperative. From the astronomical wisdom of Sangam-era Tamils to the sophisticated Siddha pharmacology, from modern NLP research tools to Tamil Wikipedia's growing science articles, Tamil has demonstrated its capacity to be a language of science and knowledge. The ongoing development of Tamil technical vocabulary, Tamil-medium education at all levels, and Tamil science communication must be sustained and accelerated to ensure that Tamil-speaking citizens participate fully in scientific civilization with dignity, using their own language.\n\nKeywords: Ariviyal Tamil, Siddha medicine, Tamil technical vocabulary, Tamil medium education, TIVA, TDIL, Kanithamizh, terminology, Wikipedia, science communication",
    "answerTamil": "அறிமுகம்:\nஅறிவியல் தமிழ் (Ariviyal Tamil) என்பது அறிவியல், தொழில்நுட்ப மற்றும் தொழில்நுட்ப அறிவை வெளிப்படுத்துவதற்கு தமிழ் மொழியை முறையாக பயன்படுத்துவது மற்றும் மேம்படுத்துவதை குறிக்கிறது. தமிழ் தொழில்நுட்ப சொல்லாக்கம் உருவாக்கல், அறிவியல் எழுத்து, தமிழில் தொழில்நுட்ப கல்வி ஆகியவை இதில் அடங்கும்.\n\nI. அறிவியல் தமிழின் வரலாற்றுப் பின்னணி:\n\nபண்டைய அறிவியல் தமிழ்:\n• வானவியல்: புறநானூறு நட்சத்திர அமைவுகளை குறிப்பிடுகிறது; பண்டைய தமிழர்கள் நட்சத்திரங்கள், கிரகங்களை பெயரிட்டனர்\n• மருத்துவம்: சித்த மருத்துவம் – முழு தமிழ்-மொழி மருத்துவ பாரம்பரியம்\n• வேளாண்மை: சங்க இலக்கியத்தில் நுட்பமான வேளாண்மை அறிவு\n• கட்டடக்கலை: கோவில் கட்டுமான நூல்கள் (ஆகம நூல்கள்) துல்லியமான கட்டடக்கலை அறிவியலை கொண்டுள்ளன\n\nIII காலனிய கால சவால்:\n• பிரிட்டிஷ் காலனியம் ஆங்கிலத்தை அறிவியல் மொழியாக நிறுவியது\n• தமிழ் அறிவியல் கல்வி பெரும்பாலும் நீக்கப்பட்டது\n\nII. அறிவியல் தமிழின் தேவை:\n\n1. தாய்மொழியில் கல்வி:\n• மாணவர்கள் தாய்மொழியில் கருத்துகளை சிறப்பாக புரிந்துகொள்கிறார்கள் என்று ஆராய்ச்சி காட்டுகிறது\n• தமிழ் ஊடக அறிவியல் கல்விக்கு வலுவான தமிழ் அறிவியல் சொல்வளஞ்சேரி தேவை\n\n2. அறிவை ஜனநாயகப்படுத்தல்:\n• தமிழில் அறிவியல் சாதாரண தமிழ் குடிமக்களுக்கு அறிவை அணுகக்கூடியதாக ஆக்குகிறது\n\n3. கலாச்சார அடையாளம்:\n• தமிழில் அறிவியல் அறிவு அனைவருக்கும் சொந்தமானது என்பதை வலிமைப்படுத்துகிறது\n\nIII. தமிழ் தொழில்நுட்ப சொல்வளஞ்சேரி மேம்பாடு:\n\nதமிழ் சொல் உருவாக்கத்தின் கோட்பாடுகள்:\n1. தனித்தமிழ் சொற்கள் – உள்நாட்டு தமிழ் வேர்களை பயன்படுத்தி புதிய தொழில்நுட்ப சொற்கள் உருவாக்கல்\n   • எடுத்துக்காட்டு: வேதியியல் (Chemistry), உயிரியல் (Biology)\n\n2. ஒலிபெயர்ப்பு – தமிழ் ஒலியியலுடன் வெளிநாட்டு தொழில்நுட்ப சொற்களை தகவமைத்தல்\n   • எடுத்துக்காட்டு: ஆக்ஸிஜன் (Oxygen), நைட்ரஜன் (Nitrogen)\n\nமுக்கிய தமிழ் தொழில்நுட்ப சொற்கள்:\n• வேதியியல்: மூலகம், சேர்மம், கலவை\n• இயற்பியல்: விசை, ஆற்றல், வெப்பம், ஒளி\n• உயிரியல்: உயிரியல், செல், நுண்ணுயிர்\n• கணிதம்: கோணம், பரப்பளவு, கூட்டல்\n• தொழில்நுட்பம்: மென்பொருள், கணினி\n\nIV. அறிவியல் தமிழை மேம்படுத்தும் நிறுவனங்கள்:\n• தமிழ்நாடு அரசு – தமிழ் பாடப்புத்தகங்கள் அறிவியல் சொல்வளஞ்சேரியுடன்\n• தமிழ்நாடு பாடப்புத்தக கழகம் – அனைத்து பள்ளி பாடப்புத்தகங்களும் தமிழில்\n• TIVA – ஆன்லைன் அறிவியல் உள்ளடக்கம் தமிழில்\n• TDIL – தமிழ் தொழில்நுட்ப சொல்வளஞ்சேரி தரவுத்தளங்கள்\n\nV. அறிவியல் தமிழில் சவால்கள்:\n• சொல்வளஞ்சேரி இடைவெளிகள் – புதிய கண்டுபிடிப்புகளுக்கு தமிழ் சொற்கள் தேவை\n• நிலைத்தன்மை – வெவ்வேறு நிறுவனங்கள் வெவ்வேறு சொற்களை பயன்படுத்துகின்றன\n• ஆங்கிலத்திற்கு சில மாணவர்களின் விருப்பம்\n• பல்கலைக்கழக மட்டத்தில் ஆங்கில ஊடகம் மேலாண்மை\n\nVI. சித்த மருத்துவம் – அறிவியல் தமிழின் உயிரோட்டமான எடுத்துக்காட்டு:\n• சித்த மருத்துவம் முழுமையான தமிழ்-மொழி அறிவியல் பாரம்பரியமாக உள்ளது\n• சித்த மருத்துவ கல்லூரிகள் முழுக்க தமிழில் கற்பிக்கின்றன\n• பண்டைய சித்தர் நூல்கள்: அகத்தியர், திருமூலர் – தமிழில் வேதியியல், உடற்கூறு, மருந்தியல் கொண்டுள்ளன\n• அறிவியல் தமிழில் அறிவியலை முழுமையாக கடைப்பிடிக்கலாம் என்பதற்கான உயிரோட்டமான சான்று\n\nமுடிவுரை:\nஅறிவியல் தமிழ் ஒரு கல்வி பயிற்சி மட்டுமல்ல — இது ஒரு நாகரிக கட்டாயம். சங்க கால தமிழரின் வானியல் ஞானம் முதல் நவீன NLP ஆராய்ச்சி கருவிகள் வரை, தமிழ் விக்கிபீடியாவின் வளர்ந்துவரும் அறிவியல் கட்டுரைகள் வரை, தமிழ் அறிவியல் மொழியாக இருக்கும் திறனை நிரூபித்துள்ளது. தமிழ்பேசும் குடிமக்கள் தங்கள் சொந்த மொழியைப் பயன்படுத்தி கண்ணியத்துடன் அறிவியல் நாகரிகத்தில் முழுமையாக பங்கேற்க தமிழ் தொழில்நுட்ப சொல்வளஞ்சேரி மேம்பாட்டை நிலைத்திருக்க செய்து விரைவுப்படுத்தல் வேண்டும்.\n\nமுக்கிய சொற்கள்: அறிவியல் தமிழ், சித்த மருத்துவம், தமிழ் தொழில்நுட்ப சொல்வளஞ்சேரி, தமிழ் ஊடக கல்வி, TIVA, TDIL, கணித்தமிழ், சொல்லாக்கம், விக்கிபீடியா",
    "keywordsEnglish": ["Ariviyal Tamil", "Siddha medicine", "Tamil technical vocabulary", "Tamil medium education", "TIVA", "TDIL", "Kanithamizh", "terminology", "Wikipedia", "science communication"],
    "keywordsTamil": ["அறிவியல் தமிழ்", "சித்த மருத்துவம்", "தமிழ் தொழில்நுட்ப சொல்வளஞ்சேரி", "தமிழ் ஊடக கல்வி", "TIVA", "TDIL", "கணித்தமிழ்", "சொல்லாக்கம்"]
  }
];

const unitColors = {
  "Unit I": { bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-600", text: "text-blue-700", header: "bg-blue-600" },
  "Unit II": { bg: "bg-indigo-50", border: "border-indigo-300", badge: "bg-indigo-600", text: "text-indigo-700", header: "bg-indigo-600" },
  "Unit III": { bg: "bg-violet-50", border: "border-violet-300", badge: "bg-violet-600", text: "text-violet-700", header: "bg-violet-600" },
  "Unit IV": { bg: "bg-emerald-50", border: "border-emerald-300", badge: "bg-emerald-600", text: "text-emerald-700", header: "bg-emerald-600" },
  "Unit V": { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-600", text: "text-amber-700", header: "bg-amber-600" },
};

const unitNames = {
  "Unit I": "Weaving & Ceramic Technology",
  "Unit II": "Design & Construction Technology",
  "Unit III": "Manufacturing Technology",
  "Unit IV": "Agriculture & Irrigation Technology",
  "Unit V": "Scientific Tamil & Tamil Computing",
};

const AnswerKey22HS006 = () => {
  const [language, setLanguage] = useState("tamil");
  const [expanded, setExpanded] = useState({});
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [selectedMarks, setSelectedMarks] = useState("All");

  const units = ["All", "Unit I", "Unit II", "Unit III", "Unit IV", "Unit V"];
  const marksFilter = ["All", "2", "16"];

  const filtered = useMemo(() => {
    return answerKey.filter(item => {
      const matchUnit = selectedUnit === "All" || item.unit === selectedUnit;
      const matchMarks = selectedMarks === "All" || String(item.marks) === selectedMarks;
      return matchUnit && matchMarks;
    });
  }, [selectedUnit, selectedMarks]);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const getMarkColor = (marks) => {
    if (marks === 2) return "bg-green-100 text-green-800 border border-green-300";
    if (marks === 16) return "bg-red-100 text-red-800 border border-red-300";
    return "bg-gray-100 text-gray-700";
  };

  const renderLongAnswer = (text) => {
    return String(text || "").split("\n").map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      const isSubtitle = trimmed.endsWith(":") && !trimmed.startsWith("•");

      return (
        <div key={index} className={`whitespace-pre-wrap ${isSubtitle ? "font-bold text-slate-900" : ""}`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* STICKY HEADER */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm sm:top-[72px]">
        <div className="max-w-4xl mx-auto px-4 py-2 sm:py-1.5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-lg font-bold text-slate-800 leading-tight sm:text-xl">22HS006 Answer Key</h1>
              <p className="text-[11px] text-slate-500 sm:text-xs">Tamil & Technology | Bannari Amman Institute</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="flex self-start rounded-lg bg-slate-100 p-0.5">
              <button
                onClick={() => setLanguage("english")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${language === "english" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-800"}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("tamil")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${language === "tamil" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-800"}`}
              >
                தமிழ்
              </button>
              </div>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                className="min-w-[7rem] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {units.map(u => <option key={u} value={u}>{u === "All" ? "All Units" : u}</option>)}
              </select>
              <select
                value={selectedMarks}
                onChange={e => setSelectedMarks(e.target.value)}
                className="min-w-[7.5rem] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {marksFilter.map(m => <option key={m} value={m}>{m === "All" ? "All Marks" : `${m} Marks`}</option>)}
              </select>
              <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
                <span>{filtered.length} questions</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-medium">{language === "english" ? "No questions found" : "கேள்விகள் கிடைக்கவில்லை"}</p>
          </div>
        )}
        {filtered.map((item, idx) => {
          const id = `${item.unit}-${item.qNo}`;
          const isOpen = expanded[id];
          const c = unitColors[item.unit] || unitColors["Unit I"];
          const question = language === "english" ? item.questionEnglish : item.questionTamil;
          const answer = language === "english" ? item.answerEnglish : item.answerTamil;
          const keywords = language === "english" ? item.keywordsEnglish : item.keywordsTamil;
          const unitName = unitNames[item.unit];

          return (
            <div key={id} className={`rounded-2xl border ${c.border} overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}>
              {/* Question Header */}
              <button
                onClick={() => toggle(id)}
                className={`w-full text-left ${c.bg} px-5 py-4 flex items-start gap-4 hover:brightness-95 transition`}
              >
                {/* Number Badge */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${c.header} text-white flex items-center justify-center font-bold text-sm`}>
                  {filtered.indexOf(item) + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge} text-white`}>{item.unit}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getMarkColor(item.marks)}`}>{item.marks} Marks</span>
                    <span className="text-xs text-slate-400 truncate">{unitName}</span>
                  </div>
                  <p className={`leading-snug text-slate-800 ${item.marks >= 16 ? "text-base font-medium" : "text-sm font-semibold"} ${language === "tamil" ? "font-normal" : ""}`}>
                    {question}
                  </p>
                </div>
                <span className={`flex-shrink-0 mt-1 ${c.text}`}>
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>

              {/* Answer Section */}
              {isOpen && (
                <div className="bg-white px-5 pb-5 pt-4 border-t border-slate-200">
                  {/* Answer */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">✓ Answer</p>
                    <div className={`text-sm text-slate-700 leading-relaxed ${language === "tamil" ? "text-base" : ""} ${item.marks >= 16 ? "space-y-2" : "whitespace-pre-line"}`}>
                      {item.marks >= 16 ? renderLongAnswer(answer) : answer}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="mt-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">🔑 Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.map((kw, ki) => (
                        <span key={ki} className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                 
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-200 mt-4 bg-white">
        22HS006 Answer Key • Tamil & Technology • Bannari Amman Institute of Technology
      </footer>
    </div>
  );
}

export { AnswerKey22HS006 };
export default AnswerKey22HS006;