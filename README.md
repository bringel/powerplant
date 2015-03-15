# powerplant

## Installation

First, install [node.js](http://nodejs.org) and npm.

Option 1:
clone this repository:
`git clone https://github.com/bringel/powerplant.git`
then run
`npm install --global`

Option 2:
Run
`npm install bringel/powerplant --global`

## Usage

Usage: powerplant [options]

Options:
   -i FILE, --input FILE    Name of the JSON input file. If you don't specify a file, data will be read from stdin
   -o FILE, --output FILE   name of the output file  [powers.html]
   -f, --format             Format to output the power cards in, either 'html' or 'pdf'  [html]
   --hide-feats             call with --hide-feats to disable generation of feats at the end of the page  [false]
   --hide-header            call with --hide-header to disable generation of the character header at the top of the page  [false]

### Input File Format

powerplant takes a JSON formatted input file with the following structure:

    {
      "character": "Grumbar",
      "level": 3,
      "class" : "Hunter Ranger",
      "race" : "Half-Orc",
      "powers":
      [
        {
          "name": "Split the Tree",
          "type": "Daily", (can also be "Encounter", "At Will" or "Utility")
          "level": 1,
          "description": "You fire two arrows at once, which separate in mid-flight to strike two different targets",
          "action_type": "Standard",
          "effect": null,
          "trigger": null,
          "requirement": null,
          "weapon_type": "Ranged",
          "targets": "Two creatures within 3 squares of each other",
          "attack": "Dexterity vs. AC. Make two attack rolls, take the higher result and apply it to both targets",
          "hit": "2[W] + Dexterity modifier damage",
          "note": null
        },
      ],
      "feats":
      [
        {
          "name": "Quick Draw",
          "prerequisite": "Dexterity 13",
          "benefit": "You can draw a weapon (or an object, such as a potion, stored in a belt pouch, a bandollier, or a similar container) as part of the same action used to attack with the weapon or use the object. You also gain a +2 feat bonus to initiative checks"
        }
      ]
    }

### Output
powerplant will output html that looks like this and optionally save it as a pdf

<style type="text/css">body { font-family: Helvetica, sans-serif; font-size: 14px;}.card { width: 300px; height: 350px; display: inline-block; float: left; margin: 1px; page-break-inside: avoid;}.cardHeader { color: #FFFFFF; padding-left: 5px; padding-right: 5px; font-size: 16px;}.atWill { background-color: #407040; }.encounter { background-color: #892a2a; }.daily { background-color: #1d1070; }.utility { background-color: #2e2e2e; }.left { float: left; }.right { float: right; }.clear { clear: both; }.header { font-size: 18px; clear: both;}.featTitle { font-size: 16px;}h1 { font-size: 18px; float: left;}h2 {font-size: 16px; float: right;}.featHeader { font-size: 18px;}.feat { padding: 5px; }</style><div><h1>Grumbar</h1><h2>Level 3 Hunter Ranger</h2></div><div class='clear'></div><div class='card' id='Fading Strike'><div class='cardHeader atWill'><span class='left'><strong>Fading Strike</strong></span><span class='right'>1</span><div class='clear'></div></div><div class='clear'><em>You launch an attack against your foe and then back away for safety</em></div><div><strong>At-Will</strong></div><div>Standard | <strong>Melee or Ranged</strong></div><div><strong>Dexterity vs. AC</strong> | One creature</div><br /><div><strong>Hit</strong>: 1[W] + Dexterity modifier damage, and you shift 2 squares to a square that is not adjacent to the target</div><br /><br /><div><em>Hunter Fighting Style: When making an opportunity attack, you can use this power in place of a melee basic attack</em></div></div><div class='card' id='Twin Strike'><div class='cardHeader atWill'><span class='left'><strong>Twin Strike</strong></span><span class='right'>1</span><div class='clear'></div></div><div class='clear'><em>If the first attack doesn't kill it, the second one might</em></div><div><strong>At-Will</strong></div><div>Standard | <strong>Melee or Ranged</strong></div><div><strong>Strength vs. AC (melee: main weapon and off-hand weapon) or Dexterity vs. AC (ranged), two attacks</strong> | One or two creatures</div><br /><div><strong>Requirement</strong>: undefined</strong></div><div><strong>Hit</strong>: 1[W] damage per attack</div><br /><br /><div><em>Increase damage to 2[W] at level 21</em></div></div><div class='card' id='Skirmi-h Shot'><div class='cardHeader encounter'><span class='left'><strong>Skirmish Shot</strong></span><span class='right'>1</span><div class='clear'></div></div><div class='clear'><em>You rush across the battlefield and then let off a devistating shot</em></div><div><strong>Encounter</strong></div><div>Standard | <strong>Ranged</strong></div><div><strong>Dexterity vs. AC</strong> | One creature</div><br /><div><strong>Effect</strong>: Before the attack, you move your speed</div><div><strong>Hit</strong>: 2[W] + Dexterity modifier damage</div><br /><br /></div><div class='card' id='Di-ruptive Strike'><div class='cardHeader encounter'><span class='left'><strong>Disruptive Strike</strong></span><span class='right'>3</span><div class='clear'></div></div><div class='clear'><em>You thwart an enemy's attack with a timely thrust of your blade or a quick shot from your bow</em></div><div><strong>Encounter</strong></div><div>Immediate Interrupt | <strong>Melee or Ranged</strong></div><div><strong>Strength vs. AC (melee) or Dexterity vs. AC (ranged)</strong> | The attacking creature</div><br /><div><strong>Trigger</strong>: You or an ally is attacked by a creature</div><div><strong>Hit</strong>: 1[W] + Strength modifier damage (melee) or 1[W] + Dexterity modifier damage (ranged). The target takes a penalty to its attack roll for the triggering attack equal to 3 + your Wisdom modifier.</div><br /><br /></div><div class='card' id='Split the Tree'><div class='cardHeader daily'><span class='left'><strong>Split the Tree</strong></span><span class='right'>1</span><div class='clear'></div></div><div class='clear'><em>You fire two arrows at once, which separate in mid-flight to strike two different targets</em></div><div><strong>Daily</strong></div><div>Standard | <strong>Ranged</strong></div><div><strong>Dexterity vs. AC. Make two attack rolls, take the higher result and apply it to both targets</strong> | Two creatures within 3 squares of each other</div><br /><div><strong>Hit</strong>: 2[W] + Dexterity modifier damage</div><br /><br /></div><div class='card' id='Yield Ground'><div class='cardHeader utility'><span class='left'><strong>Yield Ground</strong></span><span class='right'>2</span><div class='clear'></div></div><div class='clear'><em>Even as your foe connects, you leap backward, out of the way of further harm</em></div><div><strong>Utility</strong></div><div>Immediate Reaction | <strong>Personal</strong></div><div><strong>Trigger</strong>: An enemy damages you with a melee attack</div><div><strong>Effect</strong>: You can shift a number of squares equal to your Wisdom modifier. Gain a +2 power bonus to all defenses until the end of your next turn</div></div><div class='clear'></div><div class='featHeader'><strong>Feats</strong></div><div class='feat'><div class='featTitle'><strong>Quick Draw</strong></div><div><em>Dexterity 13</em></div><div>You can draw a weapon (or an object, such as a potion, stored in a belt pouch, a bandollier, or a similar container) as part of the same action used to attack with the weapon or use the object. You also gain a +2 feat bonus to initiative checks</div></div><div class='feat'><div class='featTitle'><strong>Far Shot</strong></div><div><em>Dexterity 13</em></div><div>When you use a projectile weapon such as a bow or a crossbow, increase both the normal range and the long range by 5 squares</div></div><div class='feat'><div class='featTitle'><strong>Two Weapon Fighting</strong></div><div><em>Dexterity 13</em></div><div>While holding a melee weapon in each hand, you gain a +1 bonus to damage rolls with your main weapon</div></div></html>
