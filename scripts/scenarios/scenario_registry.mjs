import { NUMBERS_COUNTING_SCENARIOS } from "./units/numbers_counting.mjs";
import { COLORS_SCENARIOS } from "./units/colors.mjs";
import { SHAPES_GEOMETRY_SCENARIOS } from "./units/shapes_geometry.mjs";
import { BASIC_EMOTIONS_SCENARIOS } from "./units/basic_emotions.mjs";
import { FAMILY_SCENARIOS } from "./units/family.mjs";
import { BEDROOM_SCENARIOS } from "./units/bedroom.mjs";
import { BATHROOM_SCENARIOS } from "./units/bathroom.mjs";
import { KITCHEN_SCENARIOS } from "./units/kitchen.mjs";
import { LIVING_ROOM_SCENARIOS } from "./units/living_room.mjs";
import { FRUITS_SCENARIOS } from "./units/fruits.mjs";
import { VEGETABLES_SCENARIOS } from "./units/vegetables.mjs";
import { TELLING_TIME_SCENARIOS } from "./units/telling_time.mjs";
import { DAYS_MONTHS_SCENARIOS } from "./units/days_months.mjs";
import { DAILY_ACTION_VERBS_SCENARIOS } from "./units/daily_action_verbs.mjs";
import { PREPOSITIONS_OF_PLACE_SCENARIOS } from "./units/prepositions_of_place.mjs";
import { DAILY_ROUTINES_SCENARIOS } from "./units/daily_routines.mjs";
import { CLASSROOM_SCENARIOS } from "./units/classroom.mjs";
import { TOYS_GAMES_SCENARIOS } from "./units/toys_games.mjs";
import { MARKET_SCENARIOS } from "./units/market.mjs";
import { GIVING_DIRECTIONS_SCENARIOS } from "./units/giving_directions.mjs";
import { MOVEMENT_VERBS_SCENARIOS } from "./units/movement_verbs.mjs";
import { HAND_ACTIONS_SCENARIOS } from "./units/hand_actions.mjs";
import { FARM_SCENARIOS } from "./units/farm.mjs";
import { GARDEN_SCENARIOS } from "./units/garden.mjs";
import { PARK_SCENARIOS } from "./units/park.mjs";
import { PLAYGROUND_SCENARIOS } from "./units/playground.mjs";
import { PET_SHOP_SCENARIOS } from "./units/pet_shop.mjs";
import { VET_CLINIC_SCENARIOS } from "./units/vet_clinic.mjs";
import { BAKERY_SCENARIOS } from "./units/bakery.mjs";
import { COFFEE_SHOP_SCENARIOS } from "./units/coffee_shop.mjs";
import { ICE_CREAM_SHOP_SCENARIOS } from "./units/ice_cream_shop.mjs";
import { PIZZA_SHOP_SCENARIOS } from "./units/pizza_shop.mjs";
import { RESTAURANT_SCENARIOS } from "./units/restaurant.mjs";
import { SUPERMARKET_SCENARIOS } from "./units/supermarket.mjs";
import { MEAT_SEAFOOD_SCENARIOS } from "./units/meat_seafood.mjs";
import { GRAINS_DAIRY_SCENARIOS } from "./units/grains_dairy.mjs";
import { BEVERAGES_SCENARIOS } from "./units/beverages.mjs";
import { KITCHEN_UTENSILS_SCENARIOS } from "./units/kitchen_utensils.mjs";
import { COOKING_METHODS_SCENARIOS } from "./units/cooking_methods.mjs";
import { SEASONINGS_CONDIMENTS_SCENARIOS } from "./units/seasonings_condiments.mjs";
import { SEASONS_WEATHER_SCENARIOS } from "./units/seasons_weather.mjs";
import { WEATHER_STATION_SCENARIOS } from "./units/weather_station.mjs";
import { COMMUNITY_CENTER_SCENARIOS } from "./units/community_center.mjs";
import { POLICE_STATION_SCENARIOS } from "./units/police_station.mjs";
import { FIRST_AID_ROOM_SCENARIOS } from "./units/first_aid_room.mjs";
import { GAS_STATION_SCENARIOS } from "./units/gas_station.mjs";
import { SPATIAL_RELATIONS_SCENARIOS } from "./units/spatial_relations.mjs";
import { MAPS_NAVIGATION_SCENARIOS } from "./units/maps_navigation.mjs";
import { COMMUNICATION_VERBS_SCENARIOS } from "./units/communication_verbs.mjs";
import { SHADES_TONES_SCENARIOS } from "./units/shades_tones.mjs";
import { PATTERNS_TEXTURES_SCENARIOS } from "./units/patterns_textures.mjs";
import { MATERIALS_SCENARIOS } from "./units/materials.mjs";
import { MEASUREMENTS_UNITS_SCENARIOS } from "./units/measurements_units.mjs";
import { MONEY_CURRENCY_SCENARIOS } from "./units/money_currency.mjs";
import { SPORTS_EQUIPMENT_SCENARIOS } from "./units/sports_equipment.mjs";
import { SPORTS_CENTER_SCENARIOS } from "./units/sports_center.mjs";
import { BEACH_SCENARIOS } from "./units/beach.mjs";
import { AMUSEMENT_PARK_SCENARIOS } from "./units/amusement_park.mjs";
import { HUMAN_BODY_HEAD_AND_FACE_SCENARIOS } from "./units/human_body_head_and_face.mjs";
import { HUMAN_BODY_UPPER_BODY_SCENARIOS } from "./units/human_body_upper_body.mjs";
import { HUMAN_BODY_LOWER_BODY_SCENARIOS } from "./units/human_body_lower_body.mjs";
import { HUMAN_BODY_HANDS_AND_FEET_SCENARIOS } from "./units/human_body_hands_and_feet.mjs";
import { PHYSICAL_APPEARANCE_SCENARIOS } from "./units/physical_appearance.mjs";
import { SKIN_HAIR_SCENARIOS } from "./units/skin_hair.mjs";
import { AGES_LIFE_STAGES_SCENARIOS } from "./units/ages_life_stages.mjs";
import { EVERYDAY_CLOTHING_SCENARIOS } from "./units/everyday_clothing.mjs";
import { ACCESSORIES_JEWELRY_SCENARIOS } from "./units/accessories_jewelry.mjs";
import { FOOTWEAR_SCENARIOS } from "./units/footwear.mjs";
import { EXTENDED_FAMILY_SCENARIOS } from "./units/extended_family.mjs";
import { RELATIONSHIPS_ROLES_SCENARIOS } from "./units/relationships_roles.mjs";
import { LIFE_EVENTS_SCENARIOS } from "./units/life_events.mjs";
import { BIRTHDAY_PARTY_SCENARIOS } from "./units/birthday_party.mjs";
import { WEDDING_SCENARIOS } from "./units/wedding.mjs";
import { GRADUATION_SCENARIOS } from "./units/graduation.mjs";
import { FACIAL_EXPRESSIONS_SCENARIOS } from "./units/facial_expressions.mjs";
import { COMPLEX_FEELINGS_SCENARIOS } from "./units/complex_feelings.mjs";
import { SOCIAL_SITUATIONS_SCENARIOS } from "./units/social_situations.mjs";
import { PERSONALITY_CHARACTER_SCENARIOS } from "./units/personality_character.mjs";
import { INDOOR_HOBBIES_SCENARIOS } from "./units/indoor_hobbies.mjs";
import { CREATIVE_HOBBIES_SCENARIOS } from "./units/creative_hobbies.mjs";
import { SHOPPING_MALL_SCENARIOS } from "./units/shopping_mall.mjs";
import { HOSPITAL_SCENARIOS } from "./units/hospital.mjs";
import { PHARMACY_SCENARIOS } from "./units/pharmacy.mjs";
import { DENTIST_SCENARIOS } from "./units/dentist.mjs";
import { DENTAL_CLINIC_SCENARIOS } from "./units/dental_clinic.mjs";
import { EYE_DOCTOR_SCENARIOS } from "./units/eye_doctor.mjs";
import { HAIR_SALON_SCENARIOS } from "./units/hair_salon.mjs";
import { BARBERSHOP_SCENARIOS } from "./units/barbershop.mjs";
import { SPA_SCENARIOS } from "./units/spa.mjs";
import { GYM_SCENARIOS } from "./units/gym.mjs";
import { BICYCLE_SHOP_SCENARIOS } from "./units/bicycle_shop.mjs";
import { BUS_STATION_SCENARIOS } from "./units/bus_station.mjs";
import { SUBWAY_SCENARIOS } from "./units/subway.mjs";
import { CAR_WASH_SCENARIOS } from "./units/car_wash.mjs";
import { HOTEL_SCENARIOS } from "./units/hotel.mjs";
import { LAUNDROMAT_SCENARIOS } from "./units/laundromat.mjs";
import { LIBRARY_SCENARIOS } from "./units/library.mjs";
import { ART_STUDIO_SCENARIOS } from "./units/art_studio.mjs";
import { DANCE_STUDIO_SCENARIOS } from "./units/dance_studio.mjs";
import { PHOTOGRAPHY_STUDIO_SCENARIOS } from "./units/photography_studio.mjs";
import { MUSIC_ROOM_SCENARIOS } from "./units/music_room.mjs";
import { FIVE_SENSES_SCENARIOS } from "./units/five_senses.mjs";
import { INTERNAL_ORGANS_SCENARIOS } from "./units/internal_organs.mjs";
import { SKELETON_SCENARIOS } from "./units/skeleton.mjs";
import { BODY_SYSTEMS_SCENARIOS } from "./units/body_systems.mjs";
import { CAMPING_SITE_SCENARIOS } from "./units/camping_site.mjs";
import { FOREST_SCENARIOS } from "./units/forest.mjs";
import { MOUNTAIN_SCENARIOS } from "./units/mountain.mjs";
import { RIVER_SCENARIOS } from "./units/river.mjs";
import { SAVANNA_SCENARIOS } from "./units/savanna.mjs";
import { CORAL_REEF_SCENARIOS } from "./units/coral_reef.mjs";
import { DESERT_SCENARIOS } from "./units/desert.mjs";
import { JUNGLE_SCENARIOS } from "./units/jungle.mjs";
import { VOLCANO_SCENARIOS } from "./units/volcano.mjs";
import { BIRD_SANCTUARY_SCENARIOS } from "./units/bird_sanctuary.mjs";
import { BUTTERFLY_GARDEN_SCENARIOS } from "./units/butterfly_garden.mjs";
import { INSECT_WORLD_SCENARIOS } from "./units/insect_world.mjs";
import { REPTILE_HOUSE_SCENARIOS } from "./units/reptile_house.mjs";
import { ZOO_SCENARIOS } from "./units/zoo.mjs";
import { AQUARIUM_SCENARIOS } from "./units/aquarium.mjs";
import { TRAIN_STATION_SCENARIOS } from "./units/train_station.mjs";
import { AIRPORT_SCENARIOS } from "./units/airport.mjs";
import { HARBOR_SCENARIOS } from "./units/harbor.mjs";
import { THEATER_SCENARIOS } from "./units/theater.mjs";
import { ORCHESTRA_SCENARIOS } from "./units/orchestra.mjs";
import { CINEMA_SCENARIOS } from "./units/cinema.mjs";
import { MUSEUM_SCENARIOS } from "./units/museum.mjs";
import { FESTIVAL_SCENARIOS } from "./units/festival.mjs";
import { COSTUME_SHOP_SCENARIOS } from "./units/costume_shop.mjs";
import { POTTERY_STUDIO_SCENARIOS } from "./units/pottery_studio.mjs";
import { TAILOR_SHOP_SCENARIOS } from "./units/tailor_shop.mjs";
import { COMPUTER_LAB_SCENARIOS } from "./units/computer_lab.mjs";
import { NEWSPAPER_OFFICE_SCENARIOS } from "./units/newspaper_office.mjs";
import { TV_STUDIO_SCENARIOS } from "./units/tv_studio.mjs";
import { RADIO_STATION_SCENARIOS } from "./units/radio_station.mjs";
import { POST_OFFICE_SCENARIOS } from "./units/post_office.mjs";
import { MECHANIC_SCENARIOS } from "./units/mechanic.mjs";
import { CONSTRUCTION_SITE_SCENARIOS } from "./units/construction_site.mjs";
import { FIRE_STATION_SCENARIOS } from "./units/fire_station.mjs";
import { OBSERVATORY_SCENARIOS } from "./units/observatory.mjs";
import { SCIENCE_LAB_SCENARIOS } from "./units/science_lab.mjs";
import { OFFICE_SCENARIOS } from "./units/office.mjs";
import { MEETING_ROOM_SCENARIOS } from "./units/meeting_room.mjs";
import { OFFICE_SUPPLIES_SCENARIOS } from "./units/office_supplies.mjs";
import { BUSINESS_COMMUNICATION_SCENARIOS } from "./units/business_communication.mjs";
import { COWORKING_SPACE_SCENARIOS } from "./units/coworking_space.mjs";
import { STARTUP_CULTURE_SCENARIOS } from "./units/startup_culture.mjs";
import { FREELANCING_REMOTE_WORK_SCENARIOS } from "./units/freelancing_remote_work.mjs";
import { FORMAL_BUSINESS_WEAR_SCENARIOS } from "./units/formal_business_wear.mjs";
import { BANK_SCENARIOS } from "./units/bank.mjs";
import { FINANCIAL_SERVICES_SCENARIOS } from "./units/financial_services.mjs";
import { CURRENCY_PAYMENT_SCENARIOS } from "./units/currency_payment.mjs";
import { STOCK_EXCHANGE_SCENARIOS } from "./units/stock_exchange.mjs";
import { UNIVERSITY_CAMPUS_SCENARIOS } from "./units/university_campus.mjs";
import { ACADEMIC_LIFE_SCENARIOS } from "./units/academic_life.mjs";
import { RESEARCH_STUDY_SCENARIOS } from "./units/research_study.mjs";
import { STUDENT_LIFE_SCENARIOS } from "./units/student_life.mjs";
import { PROPERTY_TYPES_SCENARIOS } from "./units/property_types.mjs";
import { REAL_ESTATE_AGENCY_SCENARIOS } from "./units/real_estate_agency.mjs";
import { HOME_FEATURES_SCENARIOS } from "./units/home_features.mjs";
import { MOVING_SETTLING_IN_SCENARIOS } from "./units/moving_settling_in.mjs";
import { CAR_TYPES_SCENARIOS } from "./units/car_types.mjs";
import { CAR_PARTS_MECHANICS_SCENARIOS } from "./units/car_parts_mechanics.mjs";
import { AUTO_DEALERSHIP_SCENARIOS } from "./units/auto_dealership.mjs";
import { DRIVING_ROAD_RULES_SCENARIOS } from "./units/driving_road_rules.mjs";
import { SMART_HOME_SCENARIOS } from "./units/smart_home.mjs";
import { TECH_GADGETS_SCENARIOS } from "./units/tech_gadgets.mjs";
import { DATA_CENTER_SCENARIOS } from "./units/data_center.mjs";
import { DRONE_WORKSHOP_SCENARIOS } from "./units/drone_workshop.mjs";
import { ELECTRIC_VEHICLE_STATION_SCENARIOS } from "./units/electric_vehicle_station.mjs";
import { _3D_PRINTER_LAB_SCENARIOS } from "./units/3d_printer_lab.mjs";
import { ROBOTICS_LAB_SCENARIOS } from "./units/robotics_lab.mjs";
import { SOLAR_FARM_SCENARIOS } from "./units/solar_farm.mjs";
import { EMBASSY_SCENARIOS } from "./units/embassy.mjs";
import { COURTROOM_SCENARIOS } from "./units/courtroom.mjs";
import { LABORATORY_SCENARIOS } from "./units/laboratory.mjs";
import { SUBMARINE_SCENARIOS } from "./units/submarine.mjs";
import { ARCTIC_SCENARIOS } from "./units/arctic.mjs";
import { SPACE_STATION_SCENARIOS } from "./units/space_station.mjs";
import { LAW_FIRM_SCENARIOS } from "./units/law_firm.mjs";
import { COURTROOM_TRIAL_SCENARIOS } from "./units/courtroom_trial.mjs";
import { LEGAL_DOCUMENTS_SCENARIOS } from "./units/legal_documents.mjs";
import { RIGHTS_REGULATIONS_SCENARIOS } from "./units/rights_regulations.mjs";
import { ARCHITECT_S_STUDIO_SCENARIOS } from "./units/architect_s_studio.mjs";
import { BUILDING_CONSTRUCTION_SCENARIOS } from "./units/building_construction.mjs";
import { ARCHITECTURE_STYLES_SCENARIOS } from "./units/architecture_styles.mjs";
import { INTERIOR_DESIGN_SCENARIOS } from "./units/interior_design.mjs";
import { FASHION_ATELIER_SCENARIOS } from "./units/fashion_atelier.mjs";
import { FABRICS_TEXTILES_SCENARIOS } from "./units/fabrics_textiles.mjs";
import { FASHION_DESIGN_SCENARIOS } from "./units/fashion_design.mjs";
import { RUNWAY_SHOW_SCENARIOS } from "./units/runway_show.mjs";
import { VINEYARD_SCENARIOS } from "./units/vineyard.mjs";
import { WINEMAKING_SCENARIOS } from "./units/winemaking.mjs";
import { WINE_TASTING_SCENARIOS } from "./units/wine_tasting.mjs";
import { WINE_CELLAR_SCENARIOS } from "./units/wine_cellar.mjs";
import { COCKTAIL_BAR_SCENARIOS } from "./units/cocktail_bar.mjs";
import { SPIRITS_LIQUEURS_SCENARIOS } from "./units/spirits_liqueurs.mjs";
import { CLASSIC_COCKTAILS_SCENARIOS } from "./units/classic_cocktails.mjs";
import { BAR_CULTURE_SCENARIOS } from "./units/bar_culture.mjs";
import { SPACE_CENTER_SCENARIOS } from "./units/space_center.mjs";

export const SCENARIO_CATALOG = {
  "numbers-counting": NUMBERS_COUNTING_SCENARIOS,
  colors: COLORS_SCENARIOS,
  "shapes-geometry": SHAPES_GEOMETRY_SCENARIOS,
  "basic-emotions": BASIC_EMOTIONS_SCENARIOS,
  family: FAMILY_SCENARIOS,
  bedroom: BEDROOM_SCENARIOS,
  bathroom: BATHROOM_SCENARIOS,
  kitchen: KITCHEN_SCENARIOS,
  "living-room": LIVING_ROOM_SCENARIOS,
  fruits: FRUITS_SCENARIOS,
  vegetables: VEGETABLES_SCENARIOS,
  "telling-time": TELLING_TIME_SCENARIOS,
  "days-months": DAYS_MONTHS_SCENARIOS,
  "daily-action-verbs": DAILY_ACTION_VERBS_SCENARIOS,
  "prepositions-of-place": PREPOSITIONS_OF_PLACE_SCENARIOS,
  "daily-routines": DAILY_ROUTINES_SCENARIOS,
  classroom: CLASSROOM_SCENARIOS,
  "toys-games": TOYS_GAMES_SCENARIOS,
  market: MARKET_SCENARIOS,
  "giving-directions": GIVING_DIRECTIONS_SCENARIOS,
  "movement-verbs": MOVEMENT_VERBS_SCENARIOS,
  "hand-actions": HAND_ACTIONS_SCENARIOS,
  farm: FARM_SCENARIOS,
  garden: GARDEN_SCENARIOS,
  park: PARK_SCENARIOS,
  playground: PLAYGROUND_SCENARIOS,
  "pet-shop": PET_SHOP_SCENARIOS,
  "vet-clinic": VET_CLINIC_SCENARIOS,
  bakery: BAKERY_SCENARIOS,
  "coffee-shop": COFFEE_SHOP_SCENARIOS,
  "ice-cream-shop": ICE_CREAM_SHOP_SCENARIOS,
  "pizza-shop": PIZZA_SHOP_SCENARIOS,
  restaurant: RESTAURANT_SCENARIOS,
  supermarket: SUPERMARKET_SCENARIOS,
  "meat-seafood": MEAT_SEAFOOD_SCENARIOS,
  "grains-dairy": GRAINS_DAIRY_SCENARIOS,
  beverages: BEVERAGES_SCENARIOS,
  "kitchen-utensils": KITCHEN_UTENSILS_SCENARIOS,
  "cooking-methods": COOKING_METHODS_SCENARIOS,
  "seasonings-condiments": SEASONINGS_CONDIMENTS_SCENARIOS,
  "seasons-weather": SEASONS_WEATHER_SCENARIOS,
  "weather-station": WEATHER_STATION_SCENARIOS,
  "community-center": COMMUNITY_CENTER_SCENARIOS,
  "police-station": POLICE_STATION_SCENARIOS,
  "first-aid-room": FIRST_AID_ROOM_SCENARIOS,
  "gas-station": GAS_STATION_SCENARIOS,
  "spatial-relations": SPATIAL_RELATIONS_SCENARIOS,
  "maps-navigation": MAPS_NAVIGATION_SCENARIOS,
  "communication-verbs": COMMUNICATION_VERBS_SCENARIOS,
  "shades-tones": SHADES_TONES_SCENARIOS,
  "patterns-textures": PATTERNS_TEXTURES_SCENARIOS,
  materials: MATERIALS_SCENARIOS,
  "measurements-units": MEASUREMENTS_UNITS_SCENARIOS,
  "money-currency": MONEY_CURRENCY_SCENARIOS,
  "sports-equipment": SPORTS_EQUIPMENT_SCENARIOS,
  "sports-center": SPORTS_CENTER_SCENARIOS,
  beach: BEACH_SCENARIOS,
  "amusement-park": AMUSEMENT_PARK_SCENARIOS,
  "human-body-head-and-face": HUMAN_BODY_HEAD_AND_FACE_SCENARIOS,
  "human-body-upper-body": HUMAN_BODY_UPPER_BODY_SCENARIOS,
  "human-body-lower-body": HUMAN_BODY_LOWER_BODY_SCENARIOS,
  "human-body-hands-and-feet": HUMAN_BODY_HANDS_AND_FEET_SCENARIOS,
  "physical-appearance": PHYSICAL_APPEARANCE_SCENARIOS,
  "skin-hair": SKIN_HAIR_SCENARIOS,
  "ages-life-stages": AGES_LIFE_STAGES_SCENARIOS,
  "everyday-clothing": EVERYDAY_CLOTHING_SCENARIOS,
  "accessories-jewelry": ACCESSORIES_JEWELRY_SCENARIOS,
  footwear: FOOTWEAR_SCENARIOS,
  "extended-family": EXTENDED_FAMILY_SCENARIOS,
  "relationships-roles": RELATIONSHIPS_ROLES_SCENARIOS,
  "life-events": LIFE_EVENTS_SCENARIOS,
  "birthday-party": BIRTHDAY_PARTY_SCENARIOS,
  wedding: WEDDING_SCENARIOS,
  graduation: GRADUATION_SCENARIOS,
  "facial-expressions": FACIAL_EXPRESSIONS_SCENARIOS,
  "complex-feelings": COMPLEX_FEELINGS_SCENARIOS,
  "social-situations": SOCIAL_SITUATIONS_SCENARIOS,
  "personality-character": PERSONALITY_CHARACTER_SCENARIOS,
  "indoor-hobbies": INDOOR_HOBBIES_SCENARIOS,
  "creative-hobbies": CREATIVE_HOBBIES_SCENARIOS,
  "shopping-mall": SHOPPING_MALL_SCENARIOS,
  hospital: HOSPITAL_SCENARIOS,
  pharmacy: PHARMACY_SCENARIOS,
  dentist: DENTIST_SCENARIOS,
  "dental-clinic": DENTAL_CLINIC_SCENARIOS,
  "eye-doctor": EYE_DOCTOR_SCENARIOS,
  "hair-salon": HAIR_SALON_SCENARIOS,
  barbershop: BARBERSHOP_SCENARIOS,
  spa: SPA_SCENARIOS,
  gym: GYM_SCENARIOS,
  "bicycle-shop": BICYCLE_SHOP_SCENARIOS,
  "bus-station": BUS_STATION_SCENARIOS,
  subway: SUBWAY_SCENARIOS,
  "car-wash": CAR_WASH_SCENARIOS,
  hotel: HOTEL_SCENARIOS,
  laundromat: LAUNDROMAT_SCENARIOS,
  library: LIBRARY_SCENARIOS,
  "art-studio": ART_STUDIO_SCENARIOS,
  "dance-studio": DANCE_STUDIO_SCENARIOS,
  "photography-studio": PHOTOGRAPHY_STUDIO_SCENARIOS,
  "music-room": MUSIC_ROOM_SCENARIOS,
  "five-senses": FIVE_SENSES_SCENARIOS,
  "internal-organs": INTERNAL_ORGANS_SCENARIOS,
  skeleton: SKELETON_SCENARIOS,
  "body-systems": BODY_SYSTEMS_SCENARIOS,
  "camping-site": CAMPING_SITE_SCENARIOS,
  forest: FOREST_SCENARIOS,
  mountain: MOUNTAIN_SCENARIOS,
  river: RIVER_SCENARIOS,
  savanna: SAVANNA_SCENARIOS,
  "coral-reef": CORAL_REEF_SCENARIOS,
  desert: DESERT_SCENARIOS,
  jungle: JUNGLE_SCENARIOS,
  volcano: VOLCANO_SCENARIOS,
  "bird-sanctuary": BIRD_SANCTUARY_SCENARIOS,
  "butterfly-garden": BUTTERFLY_GARDEN_SCENARIOS,
  "insect-world": INSECT_WORLD_SCENARIOS,
  "reptile-house": REPTILE_HOUSE_SCENARIOS,
  zoo: ZOO_SCENARIOS,
  aquarium: AQUARIUM_SCENARIOS,
  "train-station": TRAIN_STATION_SCENARIOS,
  airport: AIRPORT_SCENARIOS,
  harbor: HARBOR_SCENARIOS,
  theater: THEATER_SCENARIOS,
  orchestra: ORCHESTRA_SCENARIOS,
  cinema: CINEMA_SCENARIOS,
  museum: MUSEUM_SCENARIOS,
  festival: FESTIVAL_SCENARIOS,
  "costume-shop": COSTUME_SHOP_SCENARIOS,
  "pottery-studio": POTTERY_STUDIO_SCENARIOS,
  "tailor-shop": TAILOR_SHOP_SCENARIOS,
  "computer-lab": COMPUTER_LAB_SCENARIOS,
  "newspaper-office": NEWSPAPER_OFFICE_SCENARIOS,
  "tv-studio": TV_STUDIO_SCENARIOS,
  "radio-station": RADIO_STATION_SCENARIOS,
  "post-office": POST_OFFICE_SCENARIOS,
  mechanic: MECHANIC_SCENARIOS,
  "construction-site": CONSTRUCTION_SITE_SCENARIOS,
  "fire-station": FIRE_STATION_SCENARIOS,
  observatory: OBSERVATORY_SCENARIOS,
  "science-lab": SCIENCE_LAB_SCENARIOS,
  office: OFFICE_SCENARIOS,
  "meeting-room": MEETING_ROOM_SCENARIOS,
  "office-supplies": OFFICE_SUPPLIES_SCENARIOS,
  "business-communication": BUSINESS_COMMUNICATION_SCENARIOS,
  "coworking-space": COWORKING_SPACE_SCENARIOS,
  "startup-culture": STARTUP_CULTURE_SCENARIOS,
  "freelancing-remote-work": FREELANCING_REMOTE_WORK_SCENARIOS,
  "formal-business-wear": FORMAL_BUSINESS_WEAR_SCENARIOS,
  bank: BANK_SCENARIOS,
  "financial-services": FINANCIAL_SERVICES_SCENARIOS,
  "currency-payment": CURRENCY_PAYMENT_SCENARIOS,
  "stock-exchange": STOCK_EXCHANGE_SCENARIOS,
  "university-campus": UNIVERSITY_CAMPUS_SCENARIOS,
  "academic-life": ACADEMIC_LIFE_SCENARIOS,
  "research-study": RESEARCH_STUDY_SCENARIOS,
  "student-life": STUDENT_LIFE_SCENARIOS,
  "property-types": PROPERTY_TYPES_SCENARIOS,
  "real-estate-agency": REAL_ESTATE_AGENCY_SCENARIOS,
  "home-features": HOME_FEATURES_SCENARIOS,
  "moving-settling-in": MOVING_SETTLING_IN_SCENARIOS,
  "car-types": CAR_TYPES_SCENARIOS,
  "car-parts-mechanics": CAR_PARTS_MECHANICS_SCENARIOS,
  "auto-dealership": AUTO_DEALERSHIP_SCENARIOS,
  "driving-road-rules": DRIVING_ROAD_RULES_SCENARIOS,
  "smart-home": SMART_HOME_SCENARIOS,
  "tech-gadgets": TECH_GADGETS_SCENARIOS,
  "data-center": DATA_CENTER_SCENARIOS,
  "drone-workshop": DRONE_WORKSHOP_SCENARIOS,
  "electric-vehicle-station": ELECTRIC_VEHICLE_STATION_SCENARIOS,
  "3d-printer-lab": _3D_PRINTER_LAB_SCENARIOS,
  "robotics-lab": ROBOTICS_LAB_SCENARIOS,
  "solar-farm": SOLAR_FARM_SCENARIOS,
  embassy: EMBASSY_SCENARIOS,
  courtroom: COURTROOM_SCENARIOS,
  laboratory: LABORATORY_SCENARIOS,
  submarine: SUBMARINE_SCENARIOS,
  arctic: ARCTIC_SCENARIOS,
  "space-station": SPACE_STATION_SCENARIOS,
  "law-firm": LAW_FIRM_SCENARIOS,
  "courtroom-trial": COURTROOM_TRIAL_SCENARIOS,
  "legal-documents": LEGAL_DOCUMENTS_SCENARIOS,
  "rights-regulations": RIGHTS_REGULATIONS_SCENARIOS,
  "architect-s-studio": ARCHITECT_S_STUDIO_SCENARIOS,
  "building-construction": BUILDING_CONSTRUCTION_SCENARIOS,
  "architecture-styles": ARCHITECTURE_STYLES_SCENARIOS,
  "interior-design": INTERIOR_DESIGN_SCENARIOS,
  "fashion-atelier": FASHION_ATELIER_SCENARIOS,
  "fabrics-textiles": FABRICS_TEXTILES_SCENARIOS,
  "fashion-design": FASHION_DESIGN_SCENARIOS,
  "runway-show": RUNWAY_SHOW_SCENARIOS,
  vineyard: VINEYARD_SCENARIOS,
  winemaking: WINEMAKING_SCENARIOS,
  "wine-tasting": WINE_TASTING_SCENARIOS,
  "wine-cellar": WINE_CELLAR_SCENARIOS,
  "cocktail-bar": COCKTAIL_BAR_SCENARIOS,
  "spirits-liqueurs": SPIRITS_LIQUEURS_SCENARIOS,
  "classic-cocktails": CLASSIC_COCKTAILS_SCENARIOS,
  "bar-culture": BAR_CULTURE_SCENARIOS,
  "space-center": SPACE_CENTER_SCENARIOS,
};

export function getUnitScenarios(unitId) {
  return SCENARIO_CATALOG[unitId] || null;
}

export function reviewScenario(lesson) {
  const errors = [];
  const warnings = [];

  // 1. Text concatenation & length check
  const allText = lesson.lines.map((l) => l.text).join(" ");
  const totalChars = allText.length;
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  // Average conversational speech rate: ~140-150 words per minute (2.3-2.5 words/sec)
  const estSeconds = Math.round((wordCount / 2.3) * 10) / 10;

  if (estSeconds > 60) {
    errors.push(`Duration exceeds 60 seconds (estimated: ${estSeconds}s, words: ${wordCount})`);
  }
  if (estSeconds < 18) {
    warnings.push(`Duration is short (estimated: ${estSeconds}s, words: ${wordCount})`);
  }

  // 2. Word coverage check
  const coveredWords = [];
  const missingWords = [];

  for (const wordId of lesson.wordIds) {
    let pattern;
    if (wordId === "jalape-o" || wordId === "jalapeño") {
      pattern = /\bjalape[ñn]o(s)?\b/i;
    } else if (wordId === "buy-1-get-1-free") {
      pattern = /\bbuy\s+(?:1|one)\s+get\s+(?:1|one)\s+free\b/i;
    } else if (wordId === "o-clock") {
      pattern = /\bo['\s]?clock\b/i;
    } else if (wordId === "a-m-") {
      pattern = /(?:^|[\s\d:])a\.?m\.?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "p-m-") {
      pattern = /(?:^|[\s\d:])p\.?m\.?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "clair") {
      pattern = /(?:^|[\s"'])[eé]?clair(s)?\b/i;
    } else if (wordId === "chef-s-knife") {
      pattern = /\bchef['’\s-]*s\s+knife\b/i;
    } else if (wordId === "arm-s-length") {
      pattern = /\barm['’\s-]*s\s+length\b/i;
    } else if (wordId === "saut-" || wordId === "saute") {
      pattern = /(?:^|[\s"'])saut[eé](?:d|ed|ing|s)?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "flambe") {
      pattern = /(?:^|[\s"'])flamb[eé](?:d|ed|ing|s)?(?=[\s,.;!?]|$)/i;
    } else if (wordId === "fun-house") {
      pattern = /\bfun[\s-]?house(s)?\b/i;
    } else if (wordId === "adam-s-apple") {
      pattern = /\badam['’\s-]*s\s+apple\b/i;
    } else if (wordId === "achilles-tendon") {
      pattern = /\bachilles['’\s-]*s?\s+tendon\b/i;
    } else if (wordId === "bridge-of-nose") {
      pattern = /\bbridge\s+of\s+(?:the\s+)?nose\b/i;
    } else if (wordId === "ball-of-foot") {
      pattern = /\bball\s+of\s+(?:the\s+)?foot\b/i;
    } else if (wordId === "back-of-hand") {
      pattern = /\bback\s+of\s+(?:the\s+)?hand\b/i;
    } else if (wordId === "fianc-") {
      pattern = /\bfianc[eé]\b/i;
    } else if (wordId === "fianc-e") {
      pattern = /\bfianc[eé]e\b/i;
    } else if (wordId === "spouse-s-family") {
      pattern = /\bspouse['’\s-]*s\s+family\b/i;
    } else if (wordId === "blow-candles") {
      pattern = /\bblow\s+(?:out\s+)?(?:the\s+)?candles?\b/i;
    } else if (wordId === "you-re-welcome") {
      pattern = /\byou['’]?re\s+welcome\b/i;
    } else if (wordId === "macram-") {
      pattern = /(?:^|[\s"'])macram[eé](?=[\s,.;:!?]|$)/i;
    } else if (wordId === "bangs-fringe") {
      pattern = /\b(?:bangs(?:\/|\s+)?fringe|bangs|fringe)\b/i;
    } else if (wordId === "children-s-section") {
      pattern = /\bchildren['’\s-]*s\s+section\b/i;
    } else if (wordId === "pli") {
      pattern = /(?:^|[\s"'])pli[eé]s?(?=[\s,.;:!?]|$)/i;
    } else if (wordId === "jet") {
      pattern = /(?:^|[\s"'])jet[eé]s?(?=[\s,.;:!?]|$)/i;
    } else if (wordId === "relev") {
      pattern = /(?:^|[\s"'])relev[eé]s?(?=[\s,.;:!?]|$)/i;
    } else if (wordId === "conductor's-baton" || wordId === "conductors-baton") {
      pattern = /\bconductor['’\s-]*s\s+baton\b/i;
    } else if (wordId === "conductor-s-podium" || wordId === "conductors-podium") {
      pattern = /\bconductor['’\s-]*s\s+podium\b/i;
    } else if (wordId === "harbor-master-s-office") {
      pattern = /\bharbor\s+master['’\s-]*s\s+office\b/i;
    } else if (wordId === "pi-ata" || wordId === "pinata") {
      pattern = /\bpi[ñn]atas?\b/i;
    } else if (wordId === "potter-s-wheel") {
      pattern = /\bpotter['’\s-]*s\s+wheel\b/i;
    } else if (wordId === "wi-fi-router") {
      pattern = /\bwi[- ]?fi\s+router\b/i;
    } else if (wordId === "log-in") {
      pattern = /\blog(?:ged|ging|s)?[\s-]+in\b/i;
    } else if (wordId === "log-out") {
      pattern = /\blog(?:ged|ging|s)?[\s-]+out\b/i;
    } else if (wordId === "editor-s-desk") {
      pattern = /\beditor['’\s-]*s\s+desk\b/i;
    } else if (wordId === "clip-on-mic") {
      pattern = /\bclip[- ]on\s+mic\b/i;
    } else if (wordId === "station-id") {
      pattern = /\bstation\s+id\b/i;
    } else if (wordId === "on-air-sign") {
      pattern = /\bon[- ]air\s+sign\b/i;
    } else if (wordId === "on-air-light") {
      pattern = /\bon[- ]air\s+light\b/i;
    } else if (wordId === "po-box") {
      pattern = /\bpo\s+box\b/i;
    } else if (wordId === "post-box") {
      pattern = /\bpost\s+box\b/i;
    } else if (wordId === "ac-system") {
      pattern = /\bac[-\s]+system\b/i;
    } else if (wordId === "steel-toe-boots") {
      pattern = /\bsteel[-\s]+toe(?:d)?[-\s]+boots?\b/i;
    } else if (wordId === "ear-plugs") {
      pattern = /\bear[-\s]?plugs?\b/i;
    } else if (wordId === "ccd-camera") {
      pattern = /\bccd[-\s]+cameras?\b/i;
    } else if (wordId === "star-gazing") {
      pattern = /\bstar[-\s]?gazing\b/i;
    } else if (wordId === "kpi") {
      pattern = /\bkpis?\b/i;
    } else if (wordId === "roi") {
      pattern = /\broi\b/i;
    } else if (wordId === "touch-base") {
      pattern = /\btouch[\s-]+base\b/i;
    } else if (wordId === "circle-back") {
      pattern = /\bcircle[\s-]+back\b/i;
    } else if (wordId === "moving-forward") {
      pattern = /\bmoving[\s-]+forward\b/i;
    } else if (wordId === "action-items") {
      pattern = /\baction[\s-]+items?\b/i;
    } else if (wordId === "best-practice") {
      pattern = /\bbest[\s-]+practice\b/i;
    } else if (wordId === "open-door-policy") {
      pattern = /\bopen[\s-]+door[\s-]+policy\b/i;
    } else if (wordId === "open-floor-plan") {
      pattern = /\bopen[\s-]+floor[\s-]+plan\b/i;
    } else if (wordId === "one-on-one") {
      pattern = /\bone[\s-]+on[\s-]+one\b/i;
    } else if (wordId === "slide-deck") {
      pattern = /\bslide[\s-]+deck\b/i;
    } else if (wordId === "screen-share") {
      pattern = /\bscreen[\s-]+share\b/i;
    } else if (wordId === "virtual-background") {
      pattern = /\bvirtual[\s-]+background\b/i;
    } else if (wordId === "felt-tip-pen") {
      pattern = /\bfelt[\s-]+tip[\s-]+pen\b/i;
    } else if (wordId === "24-7-access") {
      pattern = /\b24[\/-]7\s+access\b/i;
    } else if (wordId === "lunch-learn") {
      pattern = /\blunch[-\s]+(?:and[-\s]+)?learn\b/i;
    } else if (wordId === "slack-channel") {
      pattern = /\bslack\s+channels?\b/i;
    } else if (wordId === "high-speed-wifi") {
      pattern = /\bhigh[\s-]+speed\s+wi[- ]?fi\b/i;
    } else if (wordId === "mvp") {
      pattern = /\bmvp\b/i;
    } else if (wordId === "series-a") {
      pattern = /\bseries\s+a\b/i;
    } else if (wordId === "product-market-fit") {
      pattern = /\bproduct[\s-]+market[\s-]+fit\b/i;
    } else if (wordId === "north-star") {
      pattern = /\bnorth\s+star\b/i;
    } else if (wordId === "okr") {
      pattern = /\bokrs?\b/i;
    } else if (wordId === "google-drive") {
      pattern = /\bgoogle\s+drive\b/i;
    } else if (wordId === "do-not-disturb") {
      pattern = /\bdo[\s-]+not[\s-]+disturb\b/i;
    } else if (wordId === "deep-work") {
      pattern = /\bdeep\s+work\b/i;
    } else if (wordId === "focus-mode") {
      pattern = /\bfocus\s+mode\b/i;
    } else if (wordId === "non-disclosure") {
      pattern = /\bnon[\s-]+disclosure\b/i;
    } else if (wordId === "scope-creep") {
      pattern = /\bscope\s+creep\b/i;
    } else if (wordId === "1099") {
      pattern = /\b1099\b/i;
    } else if (wordId === "llc") {
      pattern = /\bllc\b/i;
    } else if (wordId === "bow-tie") {
      pattern = /\bbow[\s-]+tie\b/i;
    } else if (wordId === "pocket-square") {
      pattern = /\bpocket\s+square\b/i;
    } else if (wordId === "button-down") {
      pattern = /\bbutton[\s-]+down\b/i;
    } else if (wordId === "wrap-dress") {
      pattern = /\bwrap\s+dress\b/i;
    } else if (wordId === "clutch-purse") {
      pattern = /\bclutch\s+purse\b/i;
    } else if (wordId === "ankle-pants") {
      pattern = /\bankle\s+pants\b/i;
    } else if (wordId === "oxford-shoes") {
      pattern = /\boxford\s+shoes\b/i;
    } else if (wordId === "p-e-ratio") {
      pattern = /\bp[\/\s-]e\s+ratio\b/i;
    } else if (wordId === "401k") {
      pattern = /\b401[\s-]?k\b|\b401\s*\(k\)\b/i;
    } else if (wordId === "etf") {
      pattern = /\betfs?\b/i;
    } else if (wordId === "nft") {
      pattern = /\bnfts?\b/i;
    } else if (wordId === "safe-deposit-box") {
      pattern = /\bsafe[\s-]+deposit[\s-]+box\b/i;
    } else if (wordId === "bachelor-s") {
      pattern = /\bbachelor['’]?s\b/i;
    } else if (wordId === "master-s") {
      pattern = /\bmaster['’]?s\b/i;
    } else if (wordId === "associate-s") {
      pattern = /\bassociate['’]?s\b/i;
    } else if (wordId === "dean-s-list") {
      pattern = /\bdean['’]?s\s+list\b/i;
    } else if (wordId === "pass-fail") {
      pattern = /\bpass[\/\s-]+fail\b/i;
    } else if (wordId === "gpa") {
      pattern = /\bgpa\b/i;
    } else if (wordId === "turnitin") {
      pattern = /\bturnitin\b/i;
    } else if (wordId === "hoa-fee") {
      pattern = /\bhoa[\s-]+fees?\b|\bhoa\b/i;
    } else if (wordId === "install-internet") {
      pattern = /\binstall[\s\w-]+internet\b/i;
    } else if (wordId === "update-license") {
      pattern = /\bupdate[\s\w'’-]+license\b/i;
    } else if (wordId === "find-doctor") {
      pattern = /\bfind[\s\w-]+doctor\b/i;
    } else if (wordId === "enroll-in-school") {
      pattern = /\benroll(?:\s+\w+)?\s+in\s+school\b/i;
    } else if (wordId === "meet-neighbors") {
      pattern = /\bmeet[\s\w-]+neighbors?\b/i;
    } else if (wordId === "explore-area") {
      pattern = /\bexplore[\s\w-]+area\b/i;
    } else if (wordId === "suv") {
      pattern = /\bsuvs?\b/i;
    } else if (wordId === "manager-s-office") {
      pattern = /\bmanager['’]?s\s+office\b/i;
    } else if (wordId === "msrp") {
      pattern = /\bmsrp\b/i;
    } else if (wordId === "carfax") {
      pattern = /\bcarfax\b/i;
    } else if (wordId === "dui") {
      pattern = /\bduis?\b/i;
    } else if (wordId === "hdmi") {
      pattern = /\bhdmi\b/i;
    } else if (wordId === "usb-c-hub") {
      pattern = /\busb[\s-]?c[\s-]+hub\b/i;
    } else if (wordId === "vr-headset") {
      pattern = /\bvr\s+headset\b/i;
    } else if (wordId === "ar-glasses") {
      pattern = /\bar\s+glasses\b/i;
    } else if (wordId === "gps-watch") {
      pattern = /\bgps\s+watch\b/i;
    } else if (wordId === "ups") {
      pattern = /\bups\b/i;
    } else if (wordId === "pdu") {
      pattern = /\bpdu\b/i;
    } else if (wordId === "dns") {
      pattern = /\bdns\b/i;
    } else if (wordId === "vpn") {
      pattern = /\bvpn\b/i;
    } else if (wordId === "raid") {
      pattern = /\braid\b/i;
    } else if (wordId === "nas") {
      pattern = /\bnas\b/i;
    } else if (wordId === "san") {
      pattern = /\bsan\b/i;
    } else if (wordId === "ssd") {
      pattern = /\bssds?\b/i;
    } else if (wordId === "cctv") {
      pattern = /\bcctv\b/i;
    } else if (wordId === "fpv-drone") {
      pattern = /\bfpv\s+drone\b/i;
    } else if (wordId === "esc") {
      pattern = /\bescs?\b/i;
    } else if (wordId === "gps-module") {
      pattern = /\bgps\s+module\b/i;
    } else if (wordId === "faa") {
      pattern = /\bfaa\b/i;
    } else if (wordId === "pid-tuning") {
      pattern = /\bpid\s+tuning\b/i;
    } else if (wordId === "bms") {
      pattern = /\bbms\b/i;
    } else if (wordId === "rfid-card") {
      pattern = /\brfid\s+card\b/i;
    } else if (wordId === "qr-code") {
      pattern = /\bqr\s+code\b/i;
    } else if (wordId === "per-kwh") {
      pattern = /\bper\s+kwh\b/i;
    } else if (wordId === "lcd-screen") {
      pattern = /\blcd\s+screen\b/i;
    } else if (wordId === "pla-filament") {
      pattern = /\bpla\s+filament\b/i;
    } else if (wordId === "abs-filament") {
      pattern = /\babs\s+filament\b/i;
    } else if (wordId === "petg-filament") {
      pattern = /\bpetg\s+filament\b/i;
    } else if (wordId === "3d-software") {
      pattern = /\b3d\s+software\b/i;
    } else if (wordId === "3d-printer") {
      pattern = /\b3d[\s-]?printers?\b/i;
    } else if (wordId === "uv-curing-lamp") {
      pattern = /\buv[\s\w-]+lamp\b/i;
    } else if (wordId === "pla") {
      pattern = /\bpla\b/i;
    } else if (wordId === "abs") {
      pattern = /\babs\b/i;
    } else if (wordId === "petg") {
      pattern = /\bpetg\b/i;
    } else if (wordId === "tpu") {
      pattern = /\btpu\b/i;
    } else if (wordId === "led") {
      pattern = /\bleds?\b/i;
    } else if (wordId === "storage-shelf") {
      pattern = /\bstorage\s+shel(f|ves)\b/i;
    } else if (wordId === "attach") {
      pattern = /\battach[eé]?s?\b/i;
    } else if (wordId === "cultural-attach") {
      pattern = /\bcultural\s+attach[eé]?s?\b/i;
    } else if (wordId === "clock-with-time-zones") {
      pattern = /\bclock\s+(?:with\s+)?time\s+zones?\b/i;
    } else if (wordId === "judge-s-bench") {
      pattern = /\bjudge['’]?s\s+bench\b/i;
    } else if (wordId === "captain-s-cabin") {
      pattern = /\bcaptain['’]?s\s+cabin\b/i;
    } else if (wordId === "id-badge") {
      pattern = /\bid\s+badges?\b/i;
    } else if (wordId === "ph-meter") {
      pattern = /\bph[\s-]meters?\b/i;
    } else if (wordId === "first-aid-kit") {
      pattern = /\bfirst[\s-]aid\s+kits?\b/i;
    } else if (wordId === "ice-breaker" || wordId === "icebreaker") {
      pattern = /\bice[\s-]?breakers?\b/i;
    } else if (wordId === "jet-pack" || wordId === "jetpack") {
      pattern = /\bjet[\s-]?packs?\b/i;
    } else if (wordId === "snow-pants") {
      pattern = /\bsnow[\s-]pants\b/i;
    } else if (wordId === "comm-dish") {
      pattern = /\bcomm\s+dish(?:es)?\b/i;
    } else if (wordId === "earth-view") {
      pattern = /\bearth\s+views?\b/i;
    } else if (wordId === "clerk-s-desk") {
      pattern = /\bclerk['’]?s\s+desk\b/i;
    } else if (wordId === "bailiff-s-post") {
      pattern = /\bbailiff['’]?s\s+post\b/i;
    } else if (wordId === "dna-evidence") {
      pattern = /\bdna\s+evidence\b/i;
    } else if (wordId === "nda") {
      pattern = /\bnda\b/i;
    } else if (wordId === "non-compete") {
      pattern = /\bnon[\s-]?compete\b/i;
    } else if (wordId === "freedom-of-speech") {
      pattern = /\bfreedom\s+of\s+speech\b/i;
    } else if (wordId === "freedom-of-religion") {
      pattern = /\bfreedom\s+of\s+religion\b/i;
    } else if (wordId === "right-to-privacy") {
      pattern = /\bright\s+to\s+privacy\b/i;
    } else if (wordId === "right-to-vote") {
      pattern = /\bright\s+to\s+vote\b/i;
    } else if (wordId === "right-to-counsel") {
      pattern = /\bright\s+to\s+counsel\b/i;
    } else if (wordId === "right-to-assembly") {
      pattern = /\bright\s+to\s+assembly\b/i;
    } else if (wordId === "right-to-petition") {
      pattern = /\bright\s+to\s+petition\b/i;
    } else if (wordId === "due-process") {
      pattern = /\bdue\s+process\b/i;
    } else if (wordId === "equal-protection") {
      pattern = /\bequal\s+protection\b/i;
    } else if (wordId === "fair-trial") {
      pattern = /\bfair\s+trial\b/i;
    } else if (wordId === "geneva-convention") {
      pattern = /\bgeneva\s+convention\b/i;
    } else if (wordId === "t-square") {
      pattern = /\bt[\s-]?squares?\b/i;
    } else if (wordId === "cad-software") {
      pattern = /\bcad\s+software\b/i;
    } else if (wordId === "3d-model") {
      pattern = /\b3d[\s-]?models?\b/i;
    } else if (wordId === "pouring-foundation") {
      pattern = /\bpouring\s+foundation\b/i;
    } else if (wordId === "drywall-installation") {
      pattern = /\bdrywall\s+installation\b/i;
    } else if (wordId === "load-bearing-wall") {
      pattern = /\bload[\s-]bearing\s+walls?\b/i;
    } else if (wordId === "beaux-arts") {
      pattern = /\bbeaux[\s-]arts\b/i;
    } else if (wordId === "art-nouveau") {
      pattern = /\bart\s+nouveau\b/i;
    } else if (wordId === "art-deco") {
      pattern = /\bart\s+deco\b/i;
    } else if (wordId === "mid-century-modern") {
      pattern = /\bmid[\s-]century[\s-]modern\b/i;
    } else if (wordId === "international-style") {
      pattern = /\binternational\s+style\b/i;
    } else if (wordId === "high-tech") {
      pattern = /\bhigh[\s-]tech\b/i;
    } else if (wordId === "smart-building") {
      pattern = /\bsmart\s+buildings?\b/i;
    } else if (wordId === "adaptive-reuse") {
      pattern = /\badaptive\s+reuse\b/i;
    } else if (wordId === "net-zero") {
      pattern = /\bnet[\s-]zero\b/i;
    } else if (wordId === "passive-house") {
      pattern = /\bpassive\s+house\b/i;
    } else if (wordId === "color-palette") {
      pattern = /\bcolor\s+palettes?\b/i;
    } else if (wordId === "accent-wall") {
      pattern = /\baccent\s+walls?\b/i;
    } else if (wordId === "led-strip") {
      pattern = /\bled\s+strips?\b/i;
    } else if (wordId === "tailor-s-chalk") {
      pattern = /\btailor['’]?s\s+chalk\b/i;
    } else if (wordId === "zipper-foot") {
      pattern = /\bzipper\s+foot\b/i;
    } else if (wordId === "gore-tex") {
      pattern = /\bgore[\s-]?tex\b/i;
    } else if (wordId === "thread-count") {
      pattern = /\bthread\s+count\b/i;
    } else if (wordId === "hand-wash") {
      pattern = /\bhand\s+wash\b/i;
    } else if (wordId === "machine-wash") {
      pattern = /\bmachine\s+wash\b/i;
    } else if (wordId === "dry-clean") {
      pattern = /\bdry\s+clean\b/i;
    } else if (wordId === "tumble-dry") {
      pattern = /\btumble\s+dry\b/i;
    } else if (wordId === "line-dry") {
      pattern = /\bline\s+dry\b/i;
    } else if (wordId === "stain-removal") {
      pattern = /\bstain\s+removal\b/i;
    } else if (wordId === "fabric-softener") {
      pattern = /\bfabric\s+softener\b/i;
    } else if (wordId === "hook-and-eye") {
      pattern = /\bhook[\s-]and[\s-]eye\b/i;
    } else if (wordId === "magnetic-clasp") {
      pattern = /\bmagnetic\s+clasp\b/i;
    } else if (wordId === "appliqu-") {
      pattern = /\bappliqu[eé]?s?\b/i;
    } else if (wordId === "pr-t-porter") {
      pattern = /\bpr[eê]t[-\s]+[aà][-\s]+porter\b/i;
    } else if (wordId === "sustainable-fashion") {
      pattern = /\bsustainable\s+fashion\b/i;
    } else if (wordId === "front-row") {
      pattern = /\bfront[\s-]row\b/i;
    } else if (wordId === "lighting-rig") {
      pattern = /\blighting[\s-]rigs?\b/i;
    } else if (wordId === "sound-system") {
      pattern = /\bsound[\s-]systems?\b/i;
    } else if (wordId === "press-area") {
      pattern = /\bpress[\s-]area\b/i;
    } else if (wordId === "vip-section") {
      pattern = /\bvip[\s-]section\b/i;
    } else if (wordId === "hair-styling") {
      pattern = /\bhair[\s-]styling\b/i;
    } else if (wordId === "music-selection") {
      pattern = /\bmusic[\s-]selection\b/i;
    } else if (wordId === "fashion-week") {
      pattern = /\bfashion\s+weeks?\b/i;
    } else if (wordId === "fashion-blog") {
      pattern = /\bfashion\s+blogs?\b/i;
    } else if (wordId === "street-style") {
      pattern = /\bstreet\s+style\b/i;
    } else if (wordId === "red-carpet") {
      pattern = /\bred\s+carpets?\b/i;
    } else if (wordId === "cabernet-sauvignon") {
      pattern = /\bcabernet[\s-]sauvignon\b/i;
    } else if (wordId === "pinot-noir") {
      pattern = /\bpinot[\s-]noir\b/i;
    } else if (wordId === "sauvignon-blanc") {
      pattern = /\bsauvignon[\s-]blanc\b/i;
    } else if (wordId === "root-stock") {
      pattern = /\broot[\s-]?stocks?\b/i;
    } else if (wordId === "bud-break") {
      pattern = /\bbud[\s-]?breaks?\b/i;
    } else if (wordId === "growing-season") {
      pattern = /\bgrowing\s+seasons?\b/i;
    } else if (wordId === "frost-protection") {
      pattern = /\bfrost[\s-]protection\b/i;
    } else if (wordId === "hand-picking") {
      pattern = /\bhand[\s-]picking\b/i;
    } else if (wordId === "cellar-master") {
      pattern = /\bcellar[\s-]masters?\b/i;
    } else if (wordId === "vineyard-manager") {
      pattern = /\bvineyard[\s-]managers?\b/i;
    } else if (wordId === "harvest-crew") {
      pattern = /\bharvest[\s-]crews?\b/i;
    } else if (wordId === "n-gociant") {
      pattern = /\bn[eé]gociants?(?![a-z])/i;
    } else if (wordId === "wine-press") {
      pattern = /\bwine[\s-]press(es)?\b/i;
    } else if (wordId === "fermentation-tank") {
      pattern = /\bfermentation[\s-]tanks?\b/i;
    } else if (wordId === "oak-barrel") {
      pattern = /\boak[\s-]barrels?\b/i;
    } else if (wordId === "stainless-steel-tank") {
      pattern = /\bstainless[\s-]steel[\s-]tanks?\b/i;
    } else if (wordId === "ph-meter") {
      pattern = /\bph[\s-]meters?\b/i;
    } else if (wordId === "corking-machine") {
      pattern = /\bcorking[\s-]machines?\b/i;
    } else if (wordId === "french-oak") {
      pattern = /\bfrench[\s-]oak\b/i;
    } else if (wordId === "american-oak") {
      pattern = /\bamerican[\s-]oak\b/i;
    } else if (wordId === "new-barrel") {
      pattern = /\bnew[\s-]barrels?\b/i;
    } else if (wordId === "used-barrel") {
      pattern = /\bused[\s-]barrels?\b/i;
    } else if (wordId === "micro-oxidation") {
      pattern = /\bmicro[\s-]?oxidation\b/i;
    } else if (wordId === "sur-lie") {
      pattern = /\bsur[\s-]lie\b/i;
    } else if (wordId === "b-tonnage") {
      pattern = /\bb[aâ]tonnage(?![a-z])/i;
    } else if (wordId === "red-wine") {
      pattern = /\bred[\s-]wines?\b/i;
    } else if (wordId === "white-wine") {
      pattern = /\bwhite[\s-]wines?\b/i;
    } else if (wordId === "ros-") {
      pattern = /\bros[eé](?![a-z])/i;
    } else if (wordId === "dessert-wine") {
      pattern = /\bdessert[\s-]wines?\b/i;
    } else if (wordId === "fortified-wine") {
      pattern = /\bfortified[\s-]wines?\b/i;
    } else if (wordId === "natural-wine") {
      pattern = /\bnatural[\s-]wines?\b/i;
    } else if (wordId === "orange-wine") {
      pattern = /\borange[\s-]wines?\b/i;
    } else if (wordId === "ice-wine") {
      pattern = /\bice[\s-]wines?\b/i;
    } else if (wordId === "full-bodied") {
      pattern = /\bfull[\s-]bodied\b/i;
    } else if (wordId === "cheese-pairing") {
      pattern = /\bcheese[\s-]pairings?\b/i;
    } else if (wordId === "meat-pairing") {
      pattern = /\bmeat[\s-]pairings?\b/i;
    } else if (wordId === "seafood-pairing") {
      pattern = /\bseafood[\s-]pairings?\b/i;
    } else if (wordId === "dessert-pairing") {
      pattern = /\bdessert[\s-]pairings?\b/i;
    } else if (wordId === "main-course") {
      pattern = /\bmain[\s-]courses?\b/i;
    } else if (wordId === "palate-cleanser") {
      pattern = /\bpalate[\s-]cleansers?\b/i;
    } else if (wordId === "tasting-menu") {
      pattern = /\btasting[\s-]menus?\b/i;
    } else if (wordId === "wine-flight") {
      pattern = /\bwine[\s-]flights?\b/i;
    } else if (wordId === "cheese-board") {
      pattern = /\bcheese[\s-]boards?\b/i;
    } else if (wordId === "wine-rack") {
      pattern = /\bwine[\s-]racks?\b/i;
    } else if (wordId === "temperature-control") {
      pattern = /\btemperature[\s-]control\b/i;
    } else if (wordId === "humidity-control") {
      pattern = /\bhumidity[\s-]control\b/i;
    } else if (wordId === "stone-wall") {
      pattern = /\bstone[\s-]walls?\b/i;
    } else if (wordId === "cellar-door") {
      pattern = /\bcellar[\s-]doors?\b/i;
    } else if (wordId === "tasting-table") {
      pattern = /\btasting[\s-]tables?\b/i;
    } else if (wordId === "dim-lighting") {
      pattern = /\bdim[\s-]lighting\b/i;
    } else if (wordId === "wine-fridge") {
      pattern = /\bwine[\s-]fridges?\b/i;
    } else if (wordId === "horizontal-storage") {
      pattern = /\bhorizontal[\s-]storage\b/i;
    } else if (wordId === "bin-number") {
      pattern = /\bbin[\s-]numbers?\b/i;
    } else if (wordId === "cellar-book") {
      pattern = /\bcellar[\s-]books?\b/i;
    } else if (wordId === "wine-glass") {
      pattern = /\bwine[\s-]glass(es)?\b/i;
    } else if (wordId === "wine-opener") {
      pattern = /\bwine[\s-]openers?\b/i;
    } else if (wordId === "wine-stopper") {
      pattern = /\bwine[\s-]stoppers?\b/i;
    } else if (wordId === "wine-pourer") {
      pattern = /\bwine[\s-]pourers?\b/i;
    } else if (wordId === "champagne-flute") {
      pattern = /\bchampagne[\s-]flutes?\b/i;
    } else if (wordId === "ice-bucket") {
      pattern = /\bice[\s-]buckets?\b/i;
    } else if (wordId === "wine-thermometer") {
      pattern = /\bwine[\s-]thermometers?\b/i;
    } else if (wordId === "napa-valley") {
      pattern = /\bnapa[\s-]valley\b/i;
    } else if (wordId === "barossa-valley") {
      pattern = /\bbarossa[\s-]valley\b/i;
    } else if (wordId === "douro-valley") {
      pattern = /\bdouro[\s-]valley\b/i;
    } else if (wordId === "bar-counter") {
      pattern = /\bbar[\s-]counters?\b/i;
    } else if (wordId === "bar-stool") {
      pattern = /\bbar[\s-]stools?\b/i;
    } else if (wordId === "back-bar") {
      pattern = /\bback[\s-]bar\b/i;
    } else if (wordId === "draft-taps") {
      pattern = /\bdraft[\s-]taps?\b/i;
    } else if (wordId === "bottle-display") {
      pattern = /\bbottle[\s-]displays?\b/i;
    } else if (wordId === "ice-well") {
      pattern = /\bice[\s-]wells?\b/i;
    } else if (wordId === "speed-rail") {
      pattern = /\bspeed[\s-]rails?\b/i;
    } else if (wordId === "garnish-tray") {
      pattern = /\bgarnish[\s-]trays?\b/i;
    } else if (wordId === "bar-mat") {
      pattern = /\bbar[\s-]mats?\b/i;
    } else if (wordId === "lounge-area") {
      pattern = /\blounge[\s-]areas?\b/i;
    } else if (wordId === "cocktail-glass") {
      pattern = /\bcocktail[\s-]glass(es)?\b/i;
    } else if (wordId === "highball-glass") {
      pattern = /\bhighball[\s-]glass(es)?\b/i;
    } else if (wordId === "rocks-glass") {
      pattern = /\brocks[\s-]glass(es)?\b/i;
    } else if (wordId === "shot-glass") {
      pattern = /\bshot[\s-]glass(es)?\b/i;
    } else if (wordId === "beer-mug") {
      pattern = /\bbeer[\s-]mugs?\b/i;
    } else if (wordId === "collins-glass") {
      pattern = /\bcollins[\s-]glass(es)?\b/i;
    } else if (wordId === "coupe-glass") {
      pattern = /\bcoupe[\s-]glass(es)?\b/i;
    } else if (wordId === "cocktail-shaker") {
      pattern = /\bcocktail[\s-]shakers?\b/i;
    } else if (wordId === "bar-spoon") {
      pattern = /\bbar[\s-]spoons?\b/i;
    } else if (wordId === "ice-tongs") {
      pattern = /\bice[\s-]tongs\b/i;
    } else if (wordId === "bottle-opener") {
      pattern = /\bbottle[\s-]openers?\b/i;
    } else if (wordId === "citrus-press") {
      pattern = /\bcitrus[\s-]press(es)?\b/i;
    } else if (wordId === "cocktail-waitress") {
      pattern = /\bcocktail[\s-]waitress(es)?\b/i;
    } else if (wordId === "triple-sec") {
      pattern = /\btriple[\s-]sec\b/i;
    } else if (wordId === "kahl-a") {
      pattern = /\bkahl[uú]a(?![a-z])/i;
    } else if (wordId === "grand-marnier") {
      pattern = /\bgrand[\s-]marnier\b/i;
    } else if (wordId === "tonic-water") {
      pattern = /\btonic[\s-]water\b/i;
    } else if (wordId === "soda-water") {
      pattern = /\bsoda[\s-]water\b/i;
    } else if (wordId === "ginger-beer") {
      pattern = /\bginger[\s-]beer\b/i;
    } else if (wordId === "cranberry-juice") {
      pattern = /\bcranberry[\s-]juice\b/i;
    } else if (wordId === "orange-juice") {
      pattern = /\borange[\s-]juice\b/i;
    } else if (wordId === "lime-juice") {
      pattern = /\blime[\s-]juice\b/i;
    } else if (wordId === "simple-syrup") {
      pattern = /\bsimple[\s-]syrup\b/i;
    } else if (wordId === "lemon-twist") {
      pattern = /\blemon[\s-]twists?\b/i;
    } else if (wordId === "lime-wedge") {
      pattern = /\blime[\s-]wedges?\b/i;
    } else if (wordId === "orange-peel") {
      pattern = /\borange[\s-]peels?\b/i;
    } else if (wordId === "mint-sprig") {
      pattern = /\bmint[\s-]sprigs?\b/i;
    } else if (wordId === "cinnamon-stick") {
      pattern = /\bcinnamon[\s-]sticks?\b/i;
    } else if (wordId === "salt-rim") {
      pattern = /\bsalt[\s-]rims?\b/i;
    } else if (wordId === "sugar-rim") {
      pattern = /\bsugar[\s-]rims?\b/i;
    } else if (wordId === "cocktail-umbrella") {
      pattern = /\bcocktail[\s-]umbrellas?\b/i;
    } else if (wordId === "old-fashioned") {
      pattern = /\bold[\s-]fashioned\b/i;
    } else if (wordId === "whiskey-sour") {
      pattern = /\bwhiskey[\s-]sour\b/i;
    } else if (wordId === "pi-a-colada") {
      pattern = /\bpi[ñn]a[\s-]colada\b/i;
    } else if (wordId === "long-island-iced-tea") {
      pattern = /\blong[\s-]island[\s-]iced[\s-]tea\b/i;
    } else if (wordId === "moscow-mule") {
      pattern = /\bmoscow[\s-]mule\b/i;
    } else if (wordId === "tom-collins") {
      pattern = /\btom[\s-]collins\b/i;
    } else if (wordId === "aperol-spritz") {
      pattern = /\baperol[\s-]spritz\b/i;
    } else if (wordId === "espresso-martini") {
      pattern = /\bespresso[\s-]martini\b/i;
    } else if (wordId === "dark-and-stormy") {
      pattern = /\bdark[\s-]+(and|'n'|&)?[\s-]+stormy\b/i;
    } else if (wordId === "double-strained") {
      pattern = /\bdouble[\s-]strained\b/i;
    } else if (wordId === "on-the-rocks") {
      pattern = /\bon[\s-]the[\s-]rocks\b/i;
    } else if (wordId === "straight-up") {
      pattern = /\bstraight[\s-]up\b/i;
    } else if (wordId === "top-shelf") {
      pattern = /\btop[\s-]shelf\b/i;
    } else if (wordId === "well-drink") {
      pattern = /\bwell[\s-]drinks?\b/i;
    } else if (wordId === "house-special") {
      pattern = /\bhouse[\s-]specials?\b/i;
    } else if (wordId === "sports-bar") {
      pattern = /\bsports[\s-]bars?\b/i;
    } else if (wordId === "dive-bar") {
      pattern = /\bdive[\s-]bars?\b/i;
    } else if (wordId === "wine-bar") {
      pattern = /\bwine[\s-]bars?\b/i;
    } else if (wordId === "rooftop-bar") {
      pattern = /\brooftop[\s-]bars?\b/i;
    } else if (wordId === "tiki-bar") {
      pattern = /\btiki[\s-]bars?\b/i;
    } else if (wordId === "happy-hour") {
      pattern = /\bhappy[\s-]hour\b/i;
    } else if (wordId === "last-call") {
      pattern = /\blast[\s-]call\b/i;
    } else if (wordId === "round-of-drinks") {
      pattern = /\bround[\s-]of[\s-]drinks\b/i;
    } else if (wordId === "designated-driver") {
      pattern = /\bdesignated[\s-]drivers?\b/i;
    } else if (wordId === "bar-tab") {
      pattern = /\bbar[\s-]tabs?\b/i;
    } else if (wordId === "cover-charge") {
      pattern = /\bcover[\s-]charges?\b/i;
    } else if (wordId === "live-music") {
      pattern = /\blive[\s-]music\b/i;
    } else if (wordId === "trivia-night") {
      pattern = /\btrivia[\s-]nights?\b/i;
    } else if (wordId === "dart-board") {
      pattern = /\bdart[\s-]boards?\b/i;
    } else if (wordId === "pool-table") {
      pattern = /\bpool[\s-]tables?\b/i;
    } else if (wordId === "comedy-night") {
      pattern = /\bcomedy[\s-]nights?\b/i;
    } else if (wordId === "open-mic") {
      pattern = /\bopen[\s-]mics?\b/i;
    } else if (wordId === "dance-floor") {
      pattern = /\bdance[\s-]floors?\b/i;
    } else if (wordId === "big-screen") {
      pattern = /\bbig[\s-]screens?\b/i;
    } else if (wordId === "ride-share") {
      pattern = /\bride[\s-]shares?\b/i;
    } else if (wordId === "water-break") {
      pattern = /\bwater[\s-]breaks?\b/i;
    } else if (wordId === "know-your-limit") {
      pattern = /\bknow[\s-]your[\s-]limits?\b/i;
    } else if (wordId === "pace-yourself") {
      pattern = /\bpace[\s-]yourself\b/i;
    } else if (wordId === "eat-before") {
      pattern = /\beat[\s-]before\b/i;
    } else if (wordId === "id-check") {
      pattern = /\bid[\s-]checks?\b/i;
    } else if (wordId === "legal-age") {
      pattern = /\blegal[\s-]age\b/i;
    } else if (wordId === "cut-off") {
      pattern = /\bcut[\s-]off\b/i;
    } else if (wordId === "space-shuttle") {
      pattern = /\bspace[\s-]shuttles?\b/i;
    } else if (wordId === "launch-pad") {
      pattern = /\blaunch[\s-]pads?\b/i;
    } else if (wordId === "mission-control") {
      pattern = /\bmission[\s-]control\b/i;
    } else if (wordId === "black-hole") {
      pattern = /\bblack[\s-]holes?\b/i;
    } else if (wordId === "cosmic-dust") {
      pattern = /\bcosmic[\s-]dust\b/i;
    } else if (wordId === "solar-panel") {
      pattern = /\bsolar[\s-]panels?\b/i;
    } else if (wordId === "fuel-tank") {
      pattern = /\bfuel[\s-]tanks?\b/i;
    } else if (wordId === "heat-shield") {
      pattern = /\bheat[\s-]shields?\b/i;
    } else if (wordId === "robotic-arm") {
      pattern = /\brobotic[\s-]arms?\b/i;
    } else {
      const parts = wordId.toLowerCase().split("-").filter(Boolean).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const patternStr = `\\b` + parts.join("(?:[-\\s]+(?:a|an|the|my|your|his|her|our|their)[-\\s]+|[-\\s]+)") + `(s|es|d|ed|ing)?\\b`;
      pattern = new RegExp(patternStr, "i");
    }

    if (pattern.test(allText)) {
      coveredWords.push(wordId);
    } else {
      missingWords.push(wordId);
    }
  }

  if (missingWords.length > 0) {
    errors.push(`Missing target vocabulary words (${missingWords.length}/${lesson.wordIds.length}): ${missingWords.join(", ")}`);
  }

  // 3. Dialogue check
  const speakers = new Set(lesson.lines.map((l) => l.speaker));
  if (speakers.size < 2) {
    errors.push(`Dialogue must feature at least 2 distinct characters (found: ${Array.from(speakers).join(", ")})`);
  }

  // 4. Voice ID validity
  const validVoices = {
    Tariq: "JBFqnCBsd6RMkjVDRZzb",
    Adam: "bIHbv24MWmeRgasZH58o",
    Omar: "IKne3meq5aSn9XLyUdCD",
    Layla: "Xb7hH8MSUJpSbSDYk0k2",
    Hana: "cgSgspJ2msm6clMCkdW9",
  };
  for (const line of lesson.lines) {
    if (!validVoices[line.speaker]) {
      errors.push(`Unknown speaker: "${line.speaker}" in line ${line.id}`);
    } else if (line.voiceId !== validVoices[line.speaker]) {
      errors.push(`Voice ID mismatch for speaker ${line.speaker}: expected ${validVoices[line.speaker]}, got ${line.voiceId}`);
    }
  }

  const approved = errors.length === 0;

  return {
    approved,
    errors,
    warnings,
    stats: {
      lessonId: lesson.id,
      titleEn: lesson.titleEn,
      wordCount,
      totalChars,
      estSeconds,
      targetCount: lesson.wordIds.length,
      coveredCount: coveredWords.length,
      missingWords,
    },
  };
}
