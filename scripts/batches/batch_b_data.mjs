const BATCH_B = [
  {
    id: "data-center-hero",
    targetFile: "public/scene-images/data-center-hero.webp",
    prompt: "High-end technology photography of a modern enterprise data center facility. Long symmetrical corridor of tall black server rack enclosures with glowing blue and green LED status lights, perforated metal doors, and raised polished access flooring. Clean cool ambient atmosphere. Strictly human-free composition. Strictly no text, labels, numbers, brand names, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "business-communication-hero",
    targetFile: "public/scene-images/business-communication-hero.webp",
    prompt: "Executive corporate boardroom in a modern skyscraper. Long polished walnut conference table with leather chairs, large floor-to-ceiling glass windows offering panoramic view of urban skyline at twilight. Soft interior architectural lighting. Strictly human-free composition. Strictly no readable text, words, charts, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "electric-vehicle-station-hero",
    targetFile: "public/scene-images/electric-vehicle-station-hero.webp",
    prompt: "A modern electric vehicle charging plaza on a bright clear day. Sleek white and chrome EV charging pedestals with illuminated cables under a contemporary solar canopy. Clean asphalt paving and green landscaping. Strictly human-free composition. Strictly no brand logos, text, letters, or watermarks on chargers. Aspect ratio 4:3 landscape."
  },
  {
    id: "vegetables-hero",
    targetFile: "public/scene-images/vegetables-hero.webp",
    prompt: "Vibrant farmers market outdoor wooden stall overflowing with an abundant harvest of fresh vegetables: crisp carrots with green tops, dark leafy greens, ripe bell peppers, plump eggplants, and purple cabbage. Natural morning sunlight. Strictly human-free composition. Strictly no price signs, text, labels, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "fruits-hero",
    targetFile: "public/scene-images/fruits-hero.webp",
    prompt: "Abundant rustic wooden harvest display of fresh ripe fruits: red apples, sweet oranges, purple grapes, golden pears, and fresh berries arranged artfully in woven wicker baskets. Warm natural ambient lighting. Strictly human-free composition. Strictly no stickers, text, words, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "classroom-hero",
    targetFile: "public/scene-images/classroom-hero.webp",
    prompt: "Contemporary adult lecture and seminar classroom. Clean wooden seminar desks arranged neatly with comfortable chairs, clean white walls, wide windows with natural daylight, and a clean blank presentation board. Strictly human-free composition. Strictly no text, writing, numbers, or watermarks on boards. Aspect ratio 4:3 landscape."
  },
  {
    id: "telling-time-hero",
    targetFile: "public/scene-images/telling-time-hero.webp",
    prompt: "Artful horological photography of fine mechanical timepieces. Antique brass mantel clock with intricate gears beside a classic open pocket watch on a dark polished mahogany surface, soft warm golden light. Strictly human-free composition. Clean classic Roman numerals on dials, strictly no brand names, letters, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "startup-culture-hero",
    targetFile: "public/scene-images/startup-culture-hero.webp",
    prompt: "Creative tech startup loft workspace. Exposed brick walls, high industrial ceiling, large sunlit warehouse windows, open wooden collaborative desks with dual monitors, potted fiddle-leaf plants, and casual lounge seating. Strictly human-free composition. Strictly no readable text, words, logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "meeting-room-hero",
    targetFile: "public/scene-images/meeting-room-hero.webp",
    prompt: "Intimate professional meeting room with glass partition walls. Round oak table surrounded by four ergonomic fabric chairs, notebooks with blank covers, glass water pitcher, and soft warm recessed ceiling lights. Strictly human-free composition. Strictly no text, whiteboard markings, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "community-center-hero",
    targetFile: "public/scene-images/community-center-hero.webp",
    prompt: "Spacious, warm civic community center hall. Polished hardwood floor, exposed timber roof beams, large multi-pane windows filling the room with daylight, tidy rows of wooden chairs, and indoor greenery. Strictly human-free composition. Strictly no posters, readable signs, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "courtroom-trial-hero",
    targetFile: "public/scene-images/courtroom-trial-hero.webp",
    prompt: "Imposing dignified municipal courtroom. Elevated dark oak judge's bench with polished wooden gavel, enclosed witness stand, jury box railings, and tall classical wall paneling under soft formal lighting. Strictly human-free composition. Strictly no text, seals with lettering, words, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "smart-home-hero",
    targetFile: "public/scene-images/smart-home-hero.webp",
    prompt: "Ultra-modern minimalist smart living room interior. Sleek low-profile furniture, floor-to-ceiling glass doors opening to a tranquil terrace, automated ambient cove lighting along the ceiling, and a clean flush wall control panel. Strictly human-free composition. Strictly no text, brand logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "stock-exchange-hero",
    targetFile: "public/scene-images/stock-exchange-hero.webp",
    prompt: "Panoramic architectural perspective of a modern financial stock exchange hall. Curved electronic display walls with abstract graphical charts and candlestick waves, multiple workstation desks with monitors, tall trading room architecture. Strictly human-free composition. Strictly no readable ticker symbols, words, letters, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "rights-regulations-hero",
    targetFile: "public/scene-images/rights-regulations-hero.webp",
    prompt: "Prestigious law library. Towering floor-to-ceiling bookshelves lined with leather-bound legal volumes, a solid oak reading table with an antique brass balance scale of justice and green banker's lamp. Warm academic atmosphere. Strictly human-free composition. Strictly no readable book titles, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "coworking-space-hero",
    targetFile: "public/scene-images/coworking-space-hero.webp",
    prompt: "Sun-drenched urban coworking space. Long blonde-wood communal work tables, ergonomic task chairs, lush indoor plants, hanging pendant lights, and large industrial windows overlooking leafy trees. Strictly human-free composition. Strictly no laptop screen text, posters, words, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "shopping-mall-hero",
    targetFile: "public/scene-images/shopping-mall-hero.webp",
    prompt: "Grand multi-story modern shopping mall atrium. Soaring glass skylight casting bright daylight across curved white balconies, sleek glass escalators, polished terrazzo floor, and contemporary retail storefronts with warm interior window displays. Strictly human-free composition. Strictly no store name signs, text, logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "park-hero",
    targetFile: "public/scene-images/park-hero.webp",
    prompt: "Picturesque tranquil city park on a sunny morning. Winding stone pathway bordered by flowering perennial borders, manicured green lawn, mature oak and willow trees casting soft dappled shade, and an empty curved wooden bench. Strictly human-free composition. Strictly no park signs, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "tech-gadgets-hero",
    targetFile: "public/scene-images/tech-gadgets-hero.webp",
    prompt: "Premium lifestyle product photography of modern consumer technology gadgets. Sleek matte black smartphone, wireless over-ear headphones, smartwatch with clean dark face, and stylus pen neatly arranged on a minimalist oak wood surface. Soft studio lighting. Strictly human-free composition. Strictly no screen text, brand logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "daily-routines-hero",
    targetFile: "public/scene-images/daily-routines-hero.webp",
    prompt: "A serene morning bedside scene capturing daily routines. Simple elegant alarm clock, ceramic cup of steaming coffee, open blank diary, and eyeglasses resting on an oak nightstand beside a neatly made bed with white linen in warm sunrise light. Strictly human-free composition. Strictly no readable text, numbers, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "office-hero",
    targetFile: "public/scene-images/office-hero.webp",
    prompt: "Bright open-plan professional office environment. Tidy contemporary workstations with curved monitors, neat cable organization, acoustic divider screens, potted ferns, and floor-to-ceiling exterior windows. Strictly human-free composition. Strictly no readable screen text, papers with writing, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "coffee-shop-hero",
    targetFile: "public/scene-images/coffee-shop-hero.webp",
    prompt: "Artisanal specialty coffee shop interior. Polished concrete counter with a gleaming chrome commercial espresso machine, ceramic cups neatly stacked, glass pastry bell cloche, warm Edison bulb pendant lighting, and rustic wooden bar stools. Strictly human-free composition. Strictly no menu board text, chalk writing, logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "hotel-hero",
    targetFile: "public/scene-images/hotel-hero.webp",
    prompt: "Luxurious boutique hotel grand lobby. Gleaming book-matched marble flooring, soaring ceiling with modern glass chandelier, elegant reception concierge counter with brass accents, and plush velvet lounge seating. Soft warm ambient lighting. Strictly human-free composition. Strictly no hotel name signs, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "subway-hero",
    targetFile: "public/scene-images/subway-hero.webp",
    prompt: "Clean modern underground metro station platform. Glossy white subway tiles, polished granite platform edge with tactile yellow safety pavers, stainless steel bench, and recessed LED ceiling illumination. Empty tracks receding into tunnel. Strictly human-free composition. Strictly no transit maps, advertising posters, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "gas-station-hero",
    targetFile: "public/scene-images/gas-station-hero.webp",
    prompt: "Contemporary highway service station illuminated at twilight. Clean illuminated canopy ceiling over sleek stainless steel fuel pumps, clean concrete forecourt, and modern glass convenience store in the background. Strictly human-free composition. Strictly no brand logos, fuel price numbers, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "mechanic-hero",
    targetFile: "public/scene-images/mechanic-hero.webp",
    prompt: "Spotless modern automotive repair workshop. A vehicle chassis elevated on a hydraulic two-post lift, organized red rolling tool chests with neatly stored wrenches and sockets, clean epoxy coated floor. Bright overhead LED shop lights. Strictly human-free composition. Strictly no car brand badges, text, posters, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "car-wash-hero",
    targetFile: "public/scene-images/car-wash-hero.webp",
    prompt: "Inside a modern automated tunnel car wash. Soft blue spinning foam contour brushes, high-pressure rinse arches spraying clean water mist, vibrant colored lighting, and a glistening car windshield emerging into the dry cycle. Strictly human-free composition. Strictly no brand logos, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "barbershop-hero",
    targetFile: "public/scene-images/barbershop-hero.webp",
    prompt: "Classic upscale gentleman's barbershop interior. Antique leather barber chairs with chrome footrests facing dark wood framed mirrors, marble shelf with glass bottles of aftershave and tonics, clean folded white towels, and warm vintage wall sconces. Strictly human-free composition. Strictly no labels on bottles, text, signs, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "hair-salon-hero",
    targetFile: "public/scene-images/hair-salon-hero.webp",
    prompt: "Chic contemporary hair styling studio. Round minimalist backlit vanity mirrors along an exposed concrete wall, stylish hydraulic styling chairs, sleek black washing basins in background, and warm soft ambient lighting. Strictly human-free composition. Strictly no product brand names, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "dental-clinic-hero",
    targetFile: "public/scene-images/dental-clinic-hero.webp",
    prompt: "State-of-the-art modern dental operatory clinic room. Ergonomic mint-green patient examination chair, precision dental LED overhead light, sterile stainless steel instrument tray, and large window with peaceful garden view. Spotlessly clean clinical environment. Strictly human-free composition. Strictly no text, charts with writing, brand names, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "eye-doctor-hero",
    targetFile: "public/scene-images/eye-doctor-hero.webp",
    prompt: "Professional optometry vision examination suite. Precision phoropter vision tester mounted beside an ergonomic examination chair, slit lamp microscope on medical table, clean neutral wall finishes under calibrated clinical lighting. Strictly human-free composition. Strictly no letters on eye charts (use abstract geometric C or E rings without readable text), no words, labels, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "police-station-hero",
    targetFile: "public/scene-images/police-station-hero.webp",
    prompt: "Dignified architectural exterior of a municipal civic police department headquarters at dusk. Classical stone facade with stately columns, broad stone steps, warm architectural facade lighting, and manicured civic plaza. Strictly human-free composition. Strictly no readable building signs, lettering, police logos, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "academic-life-hero",
    targetFile: "public/scene-images/academic-life-hero.webp",
    prompt: "Magnificent classical university research library reading room. Soaring vaulted ceiling with arched windows, two stories of dark oak bookcases with brass ladders, long reading tables with brass lamps, and rich parquet flooring. Quiet scholarly atmosphere. Strictly human-free composition. Strictly no readable book titles, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "student-life-hero",
    targetFile: "public/scene-images/student-life-hero.webp",
    prompt: "Historic university campus quadrangle courtyard on a bright autumn afternoon. Neo-gothic stone archway cloisters framing a vibrant lawn with golden fallen leaves, stone benches, and historic collegiate architecture. Strictly human-free composition. Strictly no campus signs, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "university-campus-hero",
    targetFile: "public/scene-images/university-campus-hero.webp",
    prompt: "Sweeping wide architectural view of an esteemed university campus. Stately brick and limestone academic halls flanking a grand central green lawn, mature shade trees, paved pedestrian walkways, and clear blue sky. Strictly human-free composition. Strictly no university banners, text, or watermarks. Aspect ratio 4:3 landscape."
  },
  {
    id: "bicycle-shop-hero",
    targetFile: "public/scene-images/bicycle-shop-hero.webp",
    prompt: "Artisanal urban bicycle workshop and retail showroom. Row of elegant lightweight commuter and road bicycles neatly mounted on wooden wall displays, workbench with organized repair tools, brick wall with warm track lighting. Strictly human-free composition. Strictly no brand logos on bicycle frames, text, signs, or watermarks. Aspect ratio 4:3 landscape."
  }
];

export { BATCH_B };
