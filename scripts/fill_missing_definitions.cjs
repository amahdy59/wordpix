/** Curated replacements for definitions removed from the bilingual catalogue. */
const fs = require('node:fs');
const path = require('node:path');

// One definition per word ID. Unit-specific senses can be listed as unit:word-id.
const entries = `
pla|A common plastic filament used for making objects with a 3D printer.
petg|A strong, slightly flexible plastic filament used in 3D printing.
tpu|A flexible plastic filament used to print bendable objects.
wood-fill|A 3D printing filament blended with wood particles for a woodlike finish.
layer|One thin level of material added during a 3D print.
tutor|A person who teaches or helps one student or a small group.
elective|A course that a student can choose rather than one they must take.
rubric|A set of criteria used to assess a piece of work.
beanie|A close-fitting soft hat, usually made of knitted fabric.
briefcase|A flat case with a handle for carrying documents or a laptop.
scarf|A long piece of fabric worn around the neck for warmth or style.
youth|The period of life between childhood and adulthood.
adult|A person who has reached full physical growth and legal maturity.
mature|Fully developed in age, ability, or judgment.
prime|The period when a person or thing is at its best.
experienced|Having gained knowledge or skill through doing something over time.
elderly|Relating to people who are old, especially those past middle age.
senior|An older person, often one who has reached retirement age.
longevity|A long life or the length of time that someone lives.
pilot|A person trained to fly and control an aircraft.
takeoff|The moment when an aircraft leaves the ground and begins to fly.
eel|A long, narrow fish that resembles a snake and lives in water.
whale|A very large marine mammal that breathes air through a blowhole.
lobster|A large sea animal with a hard shell and two strong claws.
shrimp|A small sea animal with a curved body, many legs, and a hard shell.
pump|A device that moves water, air, or another fluid through a system.
cad-software|Computer software used to create precise technical drawings and designs.
t-square|A T-shaped ruler used to draw straight horizontal lines.
scale-ruler|A ruler marked to measure distances on drawings made to scale.
pencil-set|A collection of pencils with different grades for drawing and shading.
eraser-shield|A thin sheet with openings that limits the area being erased.
french-curve|A drawing tool with curved edges for making smooth irregular curves.
model-making-kit|A set of tools and materials for building a small design model.
laser-cutter|A machine that uses a focused laser beam to cut material precisely.
mid-century-modern|A design style from the mid-twentieth century with simple shapes and open spaces.
deconstructivist|Describing architecture with fragmented forms and unexpected angles.
biophilic|Designed to connect people with plants, natural light, and nature.
smart-building|A building that uses connected systems to control its operations.
adaptive-reuse|The practice of giving an existing building a new purpose.
net-zero|Producing or saving enough energy to balance the energy used overall.
passive-house|A highly insulated building designed to need very little heating or cooling.
cantilever|A beam or structure supported at only one end, projecting outward.
slush|Partly melted snow mixed with water on the ground.
crevasse|A deep crack in a glacier or other large mass of ice.
coastline|The outline of land where it meets the sea.
parka|A warm coat, often with a hood, worn in cold weather.
snowshoes|Flat frames worn on the feet to walk over deep snow.
igloo|A dome-shaped shelter built from blocks of hard snow.
snowshoe|A flat frame worn on a foot to walk over deep snow.
financing|Money or a loan arranged to pay for a purchase.
closing|The final stage of a sale when documents are signed and ownership changes.
new|Recently made or available, and not previously owned or used.
recall|A request for owners to return a product so a safety fault can be fixed.
service-advisor|A person who discusses vehicle repairs with customers at a dealership.
general-manager|The person responsible for the overall operation of a business.
detailer|A worker who thoroughly cleans and finishes the inside and outside of cars.
parts-specialist|A worker who identifies and supplies the correct vehicle parts.
lot-attendant|A worker who parks, moves, and prepares cars on a dealership lot.
title-clerk|A worker who handles documents that establish ownership of a vehicle.
tip|Extra money given to a worker in thanks for service.
undercut|A haircut with very short sides and longer hair on top.
strop|A leather strip used to sharpen and smooth a straight razor.
shave|The act of removing hair from the face or body with a razor.
styling|The act of arranging hair into a particular shape or look.
gel|A thick styling product used to hold hair in place.
wax|A soft styling product used to shape hair and add texture.
mousse|A light foam used to give hair volume and hold.
joyful|Feeling or showing great happiness.
excited|Feeling eager and happy about something that is going to happen.
angry|Feeling strong displeasure about something unfair or upsetting.
bored|Feeling tired of an activity because it is not interesting.
sleepy|Feeling ready to fall asleep or needing rest.
hot|Having a high temperature or feeling too warm.
cocktail|A mixed drink made with several ingredients, often including alcohol.
tandem|A bicycle built for two people riding one behind the other.
tire|A rubber covering around a wheel that grips the road.
lock|A device used to secure a bicycle or prevent access.
cap|A small covering fitted over the end of a part.
grease|A thick oily substance used to help moving parts run smoothly.
path|A route or track for walking or cycling.
falcon|A bird of prey with pointed wings that hunts other animals.
harrier|A bird of prey that flies low over open land while hunting.
perch|A branch or bar on which a bird can rest.
fly|To move through the air using wings.
sing|To make musical sounds with the voice.
feed|To give food to a person or animal, or to eat.
preen|To clean and arrange feathers with a bird's beak.
dive|To move quickly downward through air or into water.
roost|To rest or sleep on a perch, especially as a bird.
birdhouse|A small shelter put outdoors for birds to nest in.
pond|A small body of still water, usually smaller than a lake.
dance|To move the body in time with music.
present|Something given to another person as a gift.
clown|A performer who wears a funny costume and tries to make people laugh.
urine|Liquid waste made by the kidneys and passed out of the body.
timber|Wood prepared for use in building or making things.
excavation|The act of digging out earth for construction or investigation.
shelter|A covered place that protects people while they wait for a bus.
machine|A device with moving parts that performs a task.
receipt|A written or digital record showing that a payment was made.
minutes|Written notes recording what was discussed and decided at a meeting.
initiative|A new plan or action started to solve a problem or make progress.
scalable|Able to grow or handle more work without losing effectiveness.
leverage|To use a resource or advantage to achieve a result.
blue-morpho|A large tropical butterfly known for its bright blue upper wings.
cabbage-white|A small white butterfly whose caterpillars often feed on cabbage plants.
wing-dry|The stage when a newly emerged butterfly lets its wings dry.
first-flight|The first time a young or newly emerged animal flies.
spiracle|A small opening on an insect's body through which it breathes.
nectar-feeding|Taking sweet liquid from flowers as a source of food.
basking|Resting in sunlight to warm the body.
laying-eggs|Depositing eggs so that young animals can develop.
mimicry|Resembling another organism to gain protection or another advantage.
puddling|Butterflies gathering on damp ground to take in water and minerals.
roosting|Resting or sleeping in a sheltered place, especially as a bird.
guide-book|A book that helps identify species or gives information about a place.
exhaust|The gases released by an engine, or the pipe that carries them away.
limousine|A long luxury car, often driven by a hired driver.
vacuum|A machine that removes dirt by sucking in air.
polish|A substance used to make a surface smooth and shiny.
freshen|To make something smell or feel clean and pleasant again.
armrest|A support beside a seat on which a person rests an arm.
actress|A woman who performs a role in a film, play, or television show.
stirred|Mixed by moving a spoon or other tool around in a liquid.
muddled|Crushed gently to release flavor, especially fruit or herbs in a drink.
sandwich|Food made by placing a filling between slices of bread.
red|The color of a ripe tomato or a stop sign.
yellow|The color of the sun or a ripe lemon.
orange|The color between red and yellow, like an orange fruit.
pink|A light shade of red, like many rose petals.
say|To express something in spoken words.
ask|To request information or make a question.
answer|To respond to a question or request.
describe|To explain what someone or something is like in words.
shout|To speak very loudly, often to be heard from far away.
debate|To discuss different opinions on a question or topic.
agree|To share an opinion or say yes to a suggestion.
disagree|To have a different opinion from someone else.
write|To form words or sentences on paper or a screen.
revise|To change written work to improve it or correct mistakes.
exhibition|A public display of art, objects, or information.
bench|A long seat that can hold more than one person.
insecure|Not feeling confident or safe about oneself or a situation.
devotion|Deep love, loyalty, or commitment to a person or cause.
intimacy|A close personal connection involving trust and familiarity.
blanch|To put food briefly in boiling water, then cool it quickly.
braise|To cook food slowly in a covered pan with a small amount of liquid.
pressure-cook|To cook food quickly using steam held under high pressure.
double-boil|To heat food gently in a bowl or pan above hot water.
parboil|To boil food partly before finishing it another way.
broil|To cook food with direct heat from above.
fry|To cook food in hot oil or fat.
deep-fry|To cook food while it is fully covered in hot oil.
saut-|To cook food quickly in a little hot oil while stirring or tossing it.
stir-fry|To cook small pieces of food quickly in a hot pan while stirring.
pan-fry|To cook food in a pan with a small amount of oil or fat.
dice|To cut food into small, even cubes.
slice|To cut food into thin, flat pieces.
grate|To shred food into small pieces using a grater.
peel|To remove the outer skin from fruit or vegetables.
stir|To mix food or liquid by moving a spoon around in it.
fold|To mix a light ingredient gently into a heavier mixture.
toss|To turn ingredients over lightly to mix or coat them.
marinate|To leave food in a seasoned liquid so it gains flavor.
otter|A swimming mammal with thick fur and a long body that lives near water.
zipper|A fastener with two rows of teeth that join when a slider moves along them.
register|A machine or system used to record sales and accept payments.
armor|Protective clothing made to shield a person in battle or performance.
witness|A person who sees an event or gives evidence in court.
acquittal|A court decision that a person is not guilty of a charge.
printer|A machine that puts text or images from a computer onto paper.
weaving|Making cloth by crossing threads over and under one another.
canning|Preserving food by sealing it in jars or cans after heating it.
us-dollar|The basic unit of money used in the United States.
japanese-yen|The basic unit of money used in Japan.
chinese-yuan|The basic unit of money used in China.
brazilian-real|The basic unit of money used in Brazil.
mobile-payment|A payment made with a phone or other mobile device.
apple-pay|A phone payment service used to pay at a shop or online.
minimum-payment|The smallest amount due on a credit balance by a given date.
refund|Money returned to someone after they return a purchase or overpay.
chargeback|A payment reversal requested through a card issuer after a dispute.
digital-wallet|An app that stores payment details for electronic purchases.
ethereum|A blockchain network and its associated digital currency, ether.
eat|To put food in the mouth, chew it, and swallow it.
drink|To take a liquid into the mouth and swallow it.
swallow|To make food or drink move from the mouth down the throat.
cook|To prepare food by heating it.
apply|To put a product such as cream onto the skin.
moisturize|To put a product on skin to keep it from becoming dry.
floss|To clean between teeth using a thin thread or strip.
doze|To sleep lightly for a short time.
arrive|To reach a place after traveling there.
exercise|Physical activity done to improve or maintain health.
jet|A quick leap or jump in dance, especially a large traveling jump.
leap|To jump through the air, often moving forward.
kick|To strike or push something with a foot.
bandwidth|The amount of data a network connection can carry in a given time.
raid|A storage system that combines multiple drives for speed or resilience.
snapshot|A saved copy of data or system state from a particular moment.
veneer|A thin covering placed over the front of a tooth to improve its appearance.
curing-light|A light used to harden certain dental fillings and adhesives.
impression-tray|A holder used to take a mold of the teeth and gums.
luxator|A thin dental tool used to loosen a tooth before removal.
periosteal-elevator|A dental tool used to lift soft tissue away from bone.
bone-file|A dental instrument used to smooth rough edges of bone.
dental-handpiece|A powered dental tool that holds a drill or other rotating tip.
ultrasonic-scaler|A dental tool that uses vibration to remove deposits from teeth.
apex-locator|A device used to measure the length of a tooth's root canal.
wisdom-tooth|One of the last molar teeth to grow at the back of the mouth.
gum|Soft tissue around the base of the teeth.
jaw|The bones and muscles of the mouth used for biting and chewing.
alveolar-bone|The part of the jawbone that holds tooth roots in place.
dental-pulp|Soft tissue inside a tooth containing nerves and blood vessels.
dental-arch|The curved arrangement of teeth in the upper or lower jaw.
aligner|A removable clear tray used to gradually move teeth into position.
bracket|A small piece attached to a tooth to hold an orthodontic wire.
headgear|An external orthodontic appliance used to guide jaw or tooth movement.
ceramic-braces|Orthodontic braces with tooth-colored or clear brackets.
lingual-braces|Braces fixed to the inner surfaces of the teeth.
invisalign|A brand of clear removable trays used to straighten teeth.
bib|A protective cloth placed over a patient's chest during dental treatment.
monitor|A screen used to display information or images.
hawk|A bird of prey with sharp claws and keen eyesight.
merge|To join a lane of traffic from another lane or road.
lane|A marked strip of road used by one line of vehicles.
accelerate|To increase speed while driving or moving.
gps-module|A device that receives satellite signals to determine a drone's position.
roll|The side-to-side tilt of a drone around its lengthwise axis.
return-to-home|A drone function that automatically flies it back to its launch point.
hex-wrench|A tool with a hexagonal tip used to turn matching screws.
heat-shrink|Plastic tubing that tightens around a wire when heated.
zip-tie|A plastic strip that tightens to hold cables or parts together.
loctite|A brand of thread-locking liquid that helps prevent screws from loosening.
balance-charger|A charger that keeps the cells of a battery at suitable voltages.
prop-balancer|A tool used to check and correct the balance of a drone propeller.
ground-station|A computer or controller used to monitor and direct a drone remotely.
flight-log|A record of a drone's flight path, settings, and events.
waypoint|A chosen location that a drone or vehicle travels through on a route.
pid-tuning|Adjusting flight-control settings that keep a drone stable.
registration|The official recording of a drone or its owner with an authority.
license|An official document giving permission to do something.
no-fly-zone|An area where drone flights are prohibited or restricted.
visual-line-of-sight|The ability to see a drone directly without viewing it through a screen.
altitude-limit|The maximum height at which a drone is allowed to fly.
canopy|A rooflike covering that provides shade or shelter.
gift|Something given freely to another person.
shirt|A garment worn on the upper body, usually with sleeves.
blouse|A loose shirt-like garment usually worn by women.
culottes|Loose shorts that look like a skirt when worn.
jacket|A short outer garment worn over other clothes.
windbreaker|A lightweight jacket designed to block the wind.
blazer|A smart jacket worn as part of a suit or with other clothes.
first-cousin|The child of a person's aunt or uncle.
second-cousin|A person who shares great-grandparents with someone else.
great-aunt|The sister of a person's grandparent.
cousin-in-law|A relative related through marriage to a person's cousin or spouse.
spouse-s-family|The relatives of a person's husband or wife.
extended-in-laws|Relatives connected through marriage beyond immediate in-laws.
family-in-law|The family members gained through marriage.
holiday-dinner|A special meal shared with family or friends on a holiday.
birthday-celebration|An event held to mark the day someone was born.
family-wedding|A marriage ceremony attended by relatives of the couple.
hemp|A strong plant fiber used to make fabric, rope, and other products.
nylon|A strong synthetic material used in clothing and other products.
warp|The lengthwise threads held tight during weaving.
iron|A heated tool used to smooth wrinkles in fabric.
whimper|To make a quiet, weak crying sound.
scowl|To look at someone with an angry or disapproving expression.
snarl|To show the teeth and make an angry sound.
shudder|To shake suddenly because of fear, cold, or disgust.
blink|To close and open the eyes quickly.
son|A person's male child or male offspring.
daughter|A person's female child or female offspring.
parents|A person's mother and father or other primary caregivers.
little-brother|A younger male sibling in a family.
thread|A long, thin strand used for sewing fabric.
muslin|A plain, lightweight cotton fabric often used to make test garments.
fitting|A session to check and adjust how clothing sits on a person.
sample|A trial garment made to test a design before production.
buyer|A person who chooses products for a store to sell.
seam|The line where two pieces of fabric are sewn together.
gather|To draw fabric together into small folds with stitches.
velcro|A hook-and-loop fastener used to join two surfaces.
beading|Decoration made by attaching small beads to fabric.
piping|A narrow strip of fabric sewn into an edge or seam for decoration.
capsule|A small coordinated collection of clothing pieces that work together.
balloon|A flexible bag filled with air or gas for decoration.
streamer|A long narrow strip of paper or fabric used as decoration.
doughnut|A sweet fried cake, often shaped like a ring.
premium|The amount paid regularly for an insurance policy.
claim|A request for payment from an insurer after a covered loss.
pension|Money paid regularly to a person after retirement.
splint|A firm support used to keep an injured body part still.
nosebleed|Bleeding from the inside of the nose.
hypothermia|A dangerous drop in body temperature caused by exposure to cold.
echo|A sound heard again after it reflects from a surface.
vibration|A rapid back-and-forth movement that can often be felt.
pungent|Having a very strong and sharp smell or taste.
salty|Tasting of salt or containing a lot of salt.
fragrant|Having a pleasant and noticeable smell.
soft|Easy to press or bend, and not hard to the touch.
quiet|Making little or no sound.
hard|Firm and difficult to press, bend, or cut.
moccasins|Soft leather shoes with soles sewn to the upper part.
loafers|Low shoes that slip on without laces.
brogues|Sturdy shoes decorated with small punched holes.
pumps|Women's low-cut shoes, often with a heel.
pine|An evergreen tree with needle-like leaves and cones.
spruce|An evergreen tree with short needles and hanging cones.
rabbit|A small mammal with long ears and strong back legs.
bear|A large, heavy mammal with thick fur and strong claws.
beetle|An insect whose front wings form hard protective covers.
stump|The short base of a tree left after it has been cut down.
zoom|A video meeting service used for remote calls.
slack|A messaging service used by teams to communicate at work.
unleaded|Describing gasoline that does not contain added lead.
snacks|Small amounts of food eaten between meals.
motorcycle|A two-wheeled motor vehicle ridden by one or two people.
cashier|A worker who takes payments and gives change or receipts.
paying|Giving money in exchange for goods or services.
straight|Continuing in one direction without turning.
north|The direction toward the North Pole.
here|At this place or in this location.
everywhere|In all places or throughout an area.
nowhere|In no place; not anywhere.
gown|A long formal robe worn for a graduation ceremony.
banner|A long piece of fabric or paper displaying words or images.
flowers|The colorful parts of plants, often given as a gift.
toast|A short speech wishing someone success or happiness before a drink.
credit|A unit awarded for completing a course of study.
moving|Causing strong feelings, especially sympathy or sadness.
barley|A grain used as food, in animal feed, and to make beer.
bulgur|Wheat that has been boiled, dried, and broken into small pieces.
cream|The thick, rich part of milk used in cooking or desserts.
dumbbell|A short bar with a weight at each end, used for exercise.
repetition|One complete performance of an exercise movement.
sauna|A heated room in which people sit to sweat and relax.
straighten|To make hair smooth and less curly or wavy.
pomade|A greasy or waxy product used to shape and smooth hair.
dye|A substance used to change the color of hair or fabric.
clip|A small device used to hold hair in place.
hold|To keep something in the hand or arms.
clutch|To grip something tightly, often because of fear or urgency.
clench|To close the hand or teeth tightly.
pull|To draw something toward oneself or move it by force.
hurl|To throw something with great force.
lob|To throw something in a high arc.
tap|To touch something lightly and quickly.
poke|To push someone or something with a finger or pointed object.
pat|To touch gently with a flat hand, often more than once.
tickle|To touch lightly in a way that causes laughter or a tingling feeling.
massage|To rub and press the body to help it relax or feel better.
sailboat|A boat moved mainly by the wind acting on its sails.
yacht|A boat used for pleasure trips or racing.
canoe|A narrow boat moved with a paddle.
speedboat|A fast motorboat designed for travel or recreation.
warehouse|A large building used for storing goods.
hook|A curved piece of metal used to catch, hang, or lift things.
crab|A sea animal with a hard shell, ten legs, and two claws.
submarine|A vessel that can travel underwater.
navigation|The process of planning and following a route.
urologist|A doctor who treats conditions of the urinary system.
oncologist|A doctor who specializes in diagnosing and treating cancer.
chart|A record of a patient's medical information and treatment.
joint|The place where two bones meet and allow movement.
lifeline|A line in the palm that palm readers associate with a person's life.
arch|The curved raised part along the bottom of a foot.
instep|The curved top part of a foot between the toes and ankle.
toe|One of the small digits at the end of a foot.
manicure|A treatment that cleans, shapes, and cares for fingernails.
tongue|The muscular part of the mouth used for tasting, speaking, and swallowing.
gums|The soft tissue around the teeth in the mouth.
ear|The body part used to hear sounds and help with balance.
hearing|The ability to notice and understand sounds.
run|To move quickly on foot, with both feet briefly off the ground.
squat|To bend the knees and lower the body toward the ground.
tiptoe|To walk quietly on the front parts of the feet.
arm|The body part from the shoulder to the hand.
scar|A mark left on the skin after a wound has healed.
nuts|Hard-shelled seeds or fruits often eaten as food.
chalkboard|A dark board on which people write with chalk.
calligraphy|The art of making decorative, carefully formed handwriting.
drums|Percussion instruments played by striking stretched surfaces.
antiques|Old objects valued for their age, design, or history.
cricket|An insect known for the chirping sound made by its wings.
sting|A sharp painful injury caused by an insect or animal.
crawl|To move forward close to the ground on hands, knees, or legs.
buzz|To make a low humming sound, like a flying insect.
hibernate|To spend the winter in a state of greatly reduced activity.
wallpaper|Decorative paper attached to walls inside a room.
tile|A thin piece of ceramic, stone, or another material used to cover surfaces.
gorilla|A very large African ape with dark fur and great strength.
tree-frog|A small frog adapted to climb and live in trees.
trunk|The main woody stem of a tree.
forest-floor|The ground beneath trees in a forest.
rustle|To make a soft dry sound as leaves or fabric move.
heat|Warmth or a high temperature.
banana-plant|A large tropical plant that produces bunches of bananas.
rubber-tree|A tropical tree that produces latex used to make natural rubber.
sterilize|To remove or kill microorganisms on an object or surface.
clothespin|A small clip used to fasten laundry to a drying line.
spin|To rotate quickly around a central point.
consult|To seek advice from a professional or discuss a matter together.
settle|To resolve a legal dispute by agreement without a full trial.
advise|To give someone a recommendation based on knowledge or experience.
trust|A legal arrangement in which someone manages property for another person.
loss|The experience of losing someone or something important.
divorce|The legal ending of a marriage.
route|A planned way from one place to another.
watermelon|A large fruit with a green rind and sweet red or pink flesh.
meter|A metric unit of length equal to one hundred centimeters.
copper|A reddish-brown metal that conducts heat and electricity well.
gold|A valuable yellow metal used in jewelry and electronics.
acrylic|A synthetic material used for paint, fabrics, and clear plastic.
mortar|A mixture used between bricks or stones to hold them together.
kilogram|A metric unit of mass equal to one thousand grams.
distance|The amount of space between two places or objects.
quail|A small game bird sometimes raised for its meat and eggs.
veal|Meat from a young calf, used as food.
chop|A cut of meat with a bone, usually from the rib or loin.
sliced|Cut into thin, flat pieces.
approve|To officially accept or agree to a plan or request.
table|A piece of furniture with a flat top and legs.
teams|A Microsoft service for online meetings and team messages.
mute|To turn off or reduce sound from a microphone or instrument.
coin|A small round piece of metal used as money.
quarter|A United States coin worth twenty-five cents.
savings|Money kept aside for future use rather than spent now.
deposit|Money put into a bank account.
withdrawal|Money taken out of a bank account.
cash|Money in the form of notes and coins.
tax|Money collected by a government to pay for public services.
salary|A fixed amount of money paid regularly for a job.
wage|Money paid for work, often calculated by the hour.
investment|Money put into an asset or business in the hope of a return.
profit|Money left after a business pays its costs.
wolf|A wild canine that often lives and hunts in a group.
stargazing|Looking at stars and other objects in the night sky.
stride|To walk with long, confident steps.
hurdle|An obstacle that a runner jumps over in a race.
swim|To move through water using the arms, legs, or body.
snorkel|To swim near the surface while breathing through a tube.
sit|To rest the body with its weight supported on a seat.
load|To put goods or belongings into a vehicle or container.
unpack|To take belongings out of boxes or bags after moving.
mural|A large picture painted directly on a wall or ceiling.
rotunda|A large circular room, often under a dome.
ruins|The remains of a building or place that has been damaged or destroyed.
guide|A person who shows visitors around and explains what they see.
visitor|A person who goes to a place for a short time.
harp|A large string instrument played by plucking its strings.
bassoon|A long, low-pitched woodwind instrument played with a double reed.
bongo|A small hand drum usually played as part of a pair.
gong|A metal percussion instrument struck to make a deep ringing sound.
key|A part of a musical instrument pressed to produce a note.
tenth|The position after ninth in a sequence.
divided-by|Used to show that one number is being split into equal parts.
research|Careful study done to find facts or answer a question.
piccolo|A small flute that makes very high notes.
bugle|A simple brass instrument often used to play military calls.
drum|A percussion instrument played by striking a stretched surface.
damask|A patterned fabric with a design woven into its surface.
matte|Having a flat surface that does not shine or reflect much light.
textured|Having a surface with a noticeable pattern or feel.
shy|Feeling nervous or uncomfortable around other people.
lazy|Unwilling to work or make an effort.
jealous|Upset because someone has something or attention one wants.
extroverted|Enjoying social situations and time with other people.
charming|Pleasant and attractive in a way that makes people like you.
sociable|Enjoying meeting and spending time with other people.
innovative|Introducing new ideas, methods, or products.
resourceful|Good at finding practical ways to solve problems.
anxious|Feeling worried or nervous about what might happen.
collar|A band worn around an animal's neck.
leash|A strap or cord used to keep an animal close while walking it.
kitten|A young cat that is still growing.
puppy|A young dog that is still growing.
birdseed|Seeds sold as food for pet or wild birds.
kennel|A shelter or enclosure for a dog.
pet|An animal kept at home for companionship.
adopt|To take an animal into a home and become responsible for it.
pill-cutter|A small tool used to divide a pill into smaller pieces.
sandbag|A heavy bag of sand used to hold photographic equipment steady.
preset|A saved group of settings that can be applied again.
retouch|To edit a photograph to improve or change its appearance.
short|Having less height or length than usual.
pigtails|Hair arranged in two bunches, one on each side of the head.
freckles|Small brown spots that appear naturally on the skin.
chief|The person in charge of a police department or group.
boat|A small vessel used for traveling on water.
package|An object wrapped or packed for delivery.
parcel|A wrapped item sent through the mail or a delivery service.
sticker|A small piece of paper or plastic with an adhesive back.
signature|A person's name written in their own hand to show agreement or identity.
grog|Ground fired clay mixed into fresh clay to strengthen it.
coiling|A pottery method that builds a form from long rolls of clay.
pulling|Shaping a clay wall upward with the hands on a pottery wheel.
teapot|A container with a spout and handle used to brew and pour tea.
needle|A thin pointed tool used for sewing or shaping clay.
in|Inside a place or enclosed area.
on|Touching and supported by the surface of something.
under|Below something else, often covered or sheltered by it.
between|In the space separating two people or things.
near|At a short distance from someone or something.
far|At a great distance from a person or place.
opposite|On the other side, facing someone or something.
around|On every side of something, or moving in a circle.
within|Inside a place, area, or stated limit.
through|Moving into one side of something and out the other.
across|From one side of an area to the other.
along|Following the length or direction of something.
ranch|A large farm where animals are raised.
garage|A building or room used to keep a vehicle.
jingle|A short, catchy tune used in an advertisement or show.
script|The written words and directions for a play or broadcast.
broker|A person who helps clients buy, sell, or rent property.
husband|A married man in relation to his spouse.
wife|A married woman in relation to her spouse.
girlfriend|A woman in a romantic relationship with someone.
summarize|To give the main points of something in a shorter form.
memorize|To learn something so that it can be recalled later.
quote|To repeat words spoken or written by someone else.
chef|A professional cook, especially one in charge of a kitchen.
hostess|A woman who greets guests and helps seat them at a restaurant.
check|A written bill showing the cost of food or services.
enforcement|The act of making sure a rule or law is obeyed.
convention|A formal agreement between countries or groups.
diplomacy|The work of managing relations between countries through discussion.
tributary|A smaller river or stream that flows into a larger one.
kayak|A narrow boat moved with a double-bladed paddle.
raft|A flat floating platform or inflatable boat used on water.
solder|To join metal parts using a melted filler metal.
brand|A name or design that identifies a company's products.
house|A fashion company or designer's business.
elephant|A very large mammal with a trunk, tusks, and wide ears.
giraffe|A tall African mammal with a very long neck and spotted coat.
leopard|A large wild cat with a spotted coat.
camouflage|Colors or patterns that help an animal blend into its surroundings.
liquid|A substance that flows and takes the shape of its container.
oregano|An aromatic herb often used to season Mediterranean food.
overcast|Covered with clouds across most or all of the sky.
amber|A warm golden-yellow color, like the fossil resin of the same name.
beige|A pale brown color with a slightly yellow tone.
silver|A shiny gray color resembling the metal silver.
hexagon|A flat shape with six straight sides.
octagon|A flat shape with eight straight sides.
cuboid|A solid shape with six rectangular faces.
hemisphere|Half of a sphere or globe.
repeat|To do, say, or show something again.
pattern|A repeated arrangement of shapes, colors, or objects.
array|An ordered arrangement of objects, often in rows and columns.
jaw-bone|The bone that forms the lower or upper part of the mouth.
eye-socket|The bony hollow in the skull that holds an eye.
temple-bone|A bone at the side and base of the skull near the ear.
cervical-spine|The part of the backbone located in the neck.
thoracic-spine|The part of the backbone located behind the chest.
lumbar-spine|The lower back portion of the backbone.
ribcage|The ribs and breastbone that protect the heart and lungs.
toe-bones|The small bones that form the toes of the foot.
cartilage|Flexible tissue that cushions joints and supports body parts.
fracture|A break or crack in a bone.
growth-plate|An area of developing tissue near the ends of a child's long bones.
skeleton-model|A physical model showing the bones of a body.
oily-skin|Skin that produces a lot of oil and may look shiny.
dry-skin|Skin that lacks enough moisture and may feel rough or tight.
combination-skin|Skin that is oily in some areas and dry or normal in others.
sensitive-skin|Skin that reacts easily to products, temperature, or touch.
acne-prone|Likely to develop pimples or other acne spots.
mature-skin|Skin that shows changes associated with aging.
schedule|A plan showing when events or activities will happen.
goodbye|A word or expression used when leaving someone.
cheers|A friendly expression said before drinking together.
sorry|An expression used to apologize or show sympathy.
pardon|A polite word used to ask for repetition or excuse oneself.
apology|A statement expressing regret for doing something wrong.
peace|A state of calm or freedom from conflict.
sharing|Giving others part of something or using it together.
cable-tie|A plastic strip that tightens around cables to hold them together.
security-fence|A barrier built to prevent unauthorized entry into an area.
cable-tray|A support structure that holds and routes electrical cables.
lightning-rod|A metal conductor that helps protect a building from lightning.
sunlight|The light and energy that come from the sun.
energy-meter|A device that measures the amount of electrical energy used or produced.
distribution-panel|A board that divides electrical power among different circuits.
cleaning-brush|A brush used to remove dirt from a surface.
water-hose|A flexible tube used to carry water to a place.
inspection-drone|A drone used to inspect equipment or an area from the air.
thermal-camera|A camera that shows temperature differences using infrared light.
mounting-rack|A frame that holds equipment such as solar panels in place.
renewable|Able to be replaced naturally as it is used, like sunlight or wind.
masseuse|A woman whose job is to give massages.
orbit|The curved path one object follows around another in space.
hatch|A door or opening in a vehicle, ship, or spacecraft.
tether|A strong line used to keep a person or object attached and secure.
radio|A device used to send or receive sound signals without wires.
experiment|A test carried out to learn or prove something.
float|To stay suspended in air or water without falling or sinking.
repair|To fix something that is damaged or not working.
communicate|To share information or ideas with someone.
tiny|Extremely small in size compared with other things.
scrubs|Loose protective clothing worn by medical workers.
introduction|The opening part of a report or study that presents its topic.
medium|In the middle of a range of sizes or amounts.
narrow|Having a small width compared with its length.
deep|Extending a long way down from the surface.
shallow|Not extending far down from the surface.
sunken|Lower than the surrounding surface or pushed inward.
aligned|Placed in a straight line or correct position relative to something.
golf|A sport in which players hit a small ball into a series of holes.
ring|A roped square area where boxing or wrestling takes place.
cones|Small pointed markers used to set out a sports course or drill.
vision|An idea of what an organization hopes to achieve in the future.
dilution|A decrease in an owner's share when a company issues more shares.
disrupt|To change an industry by introducing a new way of doing things.
lean|Using limited resources efficiently while testing ideas quickly.
sprint|A short period of focused work to complete a set of tasks.
grant|Money given for study or research that usually need not be repaid.
mezzanine|An intermediate floor between the main floors of a station or building.
seat|A place designed for one person to sit.
plum|A small round fruit with smooth skin and a stone in the center.
beet|A root vegetable with dark red or golden flesh.
bucket|An open container with a handle for carrying water or other things.
bottle|A narrow-necked container used to hold liquids.
crate|A sturdy box used to carry or store goods.
weigh|To measure how heavy a person or thing is.
pay|To give money in exchange for something.
stock|To put goods on shelves so customers can buy them.
carry|To hold something while moving it from one place to another.
butcher|A person who prepares and sells cuts of meat.
frozen|Kept at a temperature low enough to turn water into ice.
ginger|A spicy root used to flavor food and drinks.
leather|A strong material made from animal hide.
button|A small fastener sewn to clothing and passed through a hole.
pocket|A small fabric compartment sewn into clothing to hold things.
dress|A one-piece garment worn on the body, often with a skirt.
second|A unit of time equal to one sixtieth of a minute.
hour|A period of sixty minutes.
noon|Twelve o'clock in the middle of the day.
midnight|Twelve o'clock at night, between two days.
dawn|The time in the morning when daylight first appears.
midday|The middle of the day, around twelve o'clock.
late|After the expected or planned time.
overtime|Time worked beyond the usual working hours.
dice|Small cubes marked with numbers used in games.
sled|A vehicle with runners used to travel over snow or ice.
rail|A metal track on which a train runs.
spay|To perform surgery on a female animal to prevent reproduction.
muzzle|A covering placed over an animal's mouth to stop it biting.
vintner|A person who makes or sells wine.
winemaker|A person who produces wine from grapes.
cone|The roughly cone-shaped hill built around a volcano's opening.
tremor|A small shaking movement of the ground.
kiss|To touch someone with the lips as a sign of love or greeting.
shoes|Coverings worn on the feet to protect them while walking.
sparkler|A small handheld firework that gives off bright sparks.
bride|A woman who is getting married or has just married.
groom|A man who is getting married or has just married.
decanter|A glass container used to serve wine after pouring it from a bottle.
legs|The streams of wine that run down a glass after it is swirled.
rim|The upper edge of a wine glass that touches the mouth.
sediment|Small solid particles that settle at the bottom of a liquid.
mineral|A flavor or aroma in wine that suggests stone or chalk.
bold|Having a strong, intense flavor or character.
rich|Having a full, concentrated flavor and texture.
pressing|The process of squeezing grapes to extract their juice.
sparkling|Containing bubbles of gas, especially in wine or water.
`.trim();

const definitions = new Map(entries.split('\n').map((line) => {
  const divider = line.indexOf('|');
  return [line.slice(0, divider), line.slice(divider + 1)];
}));

// The same spelling can have a different meaning in another unit.
const overrides = new Map(Object.entries({
  'barbershop:wax': 'A hair-removal product or a styling product used to shape hair.',
  'car-wash:wax': 'A protective coating applied to a car to make its surface shine.',
  'costume-shop:register': 'A machine used to record sales and take payments in a shop.',
  'fabrics-textiles:iron': 'A heated tool used to smooth wrinkles in cloth.',
  'materials:iron': 'A strong gray metal widely used to make steel and tools.',
  'hotel:iron': 'A heated appliance used to smooth wrinkles in clothes.',
  'laundromat:iron': 'A heated appliance used to smooth wrinkles in clothes.',
  'pharmacy:mortar': 'A bowl in which substances are crushed with a pestle.',
  'photography-studio:layer': 'One separate level of an image that can be edited independently.',
  'photography-studio:zoom': 'To change a camera lens so a subject appears closer or farther away.',
  'meeting-room:zoom': 'A video meeting service used for remote calls.',
  'meeting-room:table': 'A large flat piece of furniture around which people meet.',
  'shopping-mall:table': 'A flat-topped piece of furniture used to display goods or eat at.',
  'pottery-studio:wax': 'A coating applied to pottery to prevent glaze from sticking.',
  'winemaking:pump': 'A machine used to move wine or juice between containers.',
  'submarine:pump': 'A machine that moves water or other fluid through a system.',
  'aquarium:pump': 'A machine that circulates water through an aquarium.',
  'bicycle-shop:pump': 'A hand or floor device used to push air into bicycle tires.',
  'bicycle-shop:cap': 'A close-fitting cap worn by a cyclist under or without a helmet.',
  'market:roll': 'A small round or oval piece of bread served with a meal.',
  'harbor:crab': 'A sea animal with a hard shell, ten legs, and two claws.',
  'submarine:whale': 'A very large marine mammal that breathes air through a blowhole.',
  'human-body-hands-and-feet:arch': 'The curved raised part along the bottom of a foot.',
  'radio-station:script': 'The written words that presenters read during a broadcast.',
  'theater:script': 'The written dialogue and stage directions for a play.',
  'photography-studio:preset': 'A saved group of camera or editing settings.',
  'wine-cellar:capsule': 'A thin covering around the top of a wine bottle.',
  'winemaking:sparkling': 'Containing bubbles of carbon dioxide, especially in wine.',
  'reptile-house:monitor': 'A large lizard with a long neck, strong limbs, and a long tail.',
  'submarine:radio': 'A device used to send and receive messages by radio waves.',
  'space-station:radio': 'A device used to send and receive messages by radio waves.',
  'insect-world:fly': 'An insect with one pair of wings and large eyes.',
  'bird-sanctuary:fly': 'To move through the air using wings.',
  'colors:gold': 'A warm yellow color resembling the metal gold.',
  'shades-tones:gold': 'A warm yellow color resembling the metal gold.',
  'tailor-shop:pattern': 'A paper template used to cut fabric pieces for a garment.',
  'shapes-geometry:pattern': 'A repeated arrangement of shapes, colors, or objects.',
  'human-body-lower-body:run': 'To move quickly on foot, with both feet briefly off the ground.',
  'prepositions-of-place:short': 'Having less length or height than another thing.',
  'spatial-relations:short': 'Having little length or height compared with something else.',
}));

const directory = path.join(__dirname, '..', 'src', 'app', 'data', 'bilingual');
const changes = [];
const missing = [];
const pendingFiles = [];
for (const file of fs.readdirSync(directory).filter((name) => name.endsWith('.json'))) {
  const unit = file.slice(0, -5);
  const fullPath = path.join(directory, file);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let dirty = false;
  for (const [id, entry] of Object.entries(data)) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry) || entry.definition) continue;
    const definition = overrides.get(`${unit}:${id}`) ?? definitions.get(id);
    if (!definition) {
      missing.push(`${unit}:${id}`);
      continue;
    }
    if (definition.length <= 25 || !/[.!?]$/.test(definition)) {
      throw new Error(`Invalid definition for ${unit}:${id}: ${definition}`);
    }
    entry.definition = definition;
    changes.push(`${unit}:${id}`);
    dirty = true;
  }
  if (dirty) pendingFiles.push([fullPath, data]);
}
if (missing.length) {
  console.error(`${missing.length} definitions still need wording:\n${missing.join('\n')}`);
  process.exitCode = 1;
} else {
  for (const [fullPath, data] of pendingFiles) {
    fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
  console.log(`Filled ${changes.length} definitions`);
}
