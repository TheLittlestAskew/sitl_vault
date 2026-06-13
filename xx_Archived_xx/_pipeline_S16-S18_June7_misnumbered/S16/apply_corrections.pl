#!/usr/bin/perl
use strict;
use warnings;
# Read whole file
local $/;
open(my $in, '<:encoding(UTF-8)', $ARGV[0]) or die $!;
my $t = <$in>;
close $in;

# ---- Approved proper-noun corrections (word-boundary, intent-grouped per approved table) ----
# Derendil group  (longer multi-word first)
$t =~ s/\bDarren Dill\b/Derendil/g;
$t =~ s/\bDarren Dell\b/Derendil/g;
$t =~ s/\bDarren Doe\b/Derendil/g;
$t =~ s/\bDarren Dole\b/Derendil/g;
$t =~ s/\bDarren Deal\b/Derendil/g;
$t =~ s/\bDarrendil\b/Derendil/g;
$t =~ s/\bDarendyl\b/Derendil/g;
$t =~ s/\bDirendyl\b/Derendil/g;
$t =~ s/\bDarindil\b/Derendil/g;
$t =~ s/\bDurandal\b/Derendil/g;
$t =~ s/\bDaredevil\b/Derendil/g;
$t =~ s/\bDarendale\b/Derendil/g;
$t =~ s/\bArendelle\b/Derendil/g;
$t =~ s/\bDarrenil\b/Derendil/g;
$t =~ s/\bDharndil\b/Derendil/g;       # unenumerated mangling (L25) - same NPC, logged
$t =~ s/\bDarrenville\b/Derendil/g;    # unenumerated mangling (L401) - same NPC, logged

# quaggoth(s)
$t =~ s/\bQuagoths\b/quaggoths/g;
$t =~ s/\bQuagoth\b/quaggoth/g;
$t =~ s/\bquag offs\b/quaggoths/g;
$t =~ s/\bquag off\b/quaggoth/g;
$t =~ s/\bquag-off\b/quaggoth/g;
$t =~ s/\bAgarth\b/quaggoth/g;

# kuo-toa
$t =~ s/\bKuo Toa\b/kuo-toa/g;
$t =~ s/\bKuo-Toa\b/kuo-toa/g;
$t =~ s/\bQuator\b/kuo-toa/g;
$t =~ s/\bkuoa\b/kuo-toa/g;
$t =~ s/\bkwicha\b/kuo-toa/g;

# Velkynvelve
$t =~ s/\bVelkan valve\b/Velkynvelve/g;
$t =~ s/\bVulcan Valve\b/Velkynvelve/g;
$t =~ s/\bVulcan valve\b/Velkynvelve/g;
$t =~ s/\bBelkinbel\b/Velkynvelve/g;
$t =~ s/\bVulcan\b/Velkynvelve/g;

# Sloobludop (location/village) - longer first
$t =~ s/\bSloople Dob\b/Sloobludop/g;
$t =~ s/\bSloopla Dot\b/Sloobludop/g;
$t =~ s/\bSlupadab\b/Sloobludop/g;
$t =~ s/\bSlupada\b/Sloobludop/g;
$t =~ s/\bLuplada\b/Sloobludop/g;

# Sloopidoop (NPC priest) - exact multiword/variant phrases
$t =~ s/\bSnoopy Doop\b/Sloopidoop/g;
$t =~ s/\bSwoop a doop\b/Sloopidoop/g;
$t =~ s/\bSloop a dupe\b/Sloopidoop/g;
$t =~ s/\bsloop a dupe\b/Sloopidoop/g;
$t =~ s/\bSloopadoop\b/Sloopidoop/g;
$t =~ s/\bSloopadoo\b/Sloopidoop/g;
$t =~ s/\bloop a dupe\b/Sloopidoop/g;
$t =~ s/\bslip a dupe\b/Sloopidoop/g;
$t =~ s/\bslipper dupe\b/Sloopidoop/g;
$t =~ s/\bFlippy Dupe\b/Sloopidoop/g;
$t =~ s/\bFlippy Doop\b/Sloopidoop/g;
$t =~ s/\bsuper dupe\b/Sloopidoop/g;
$t =~ s/\bsuper dup\b/Sloopidoop/g;

# Glabbagool
$t =~ s/\bglad of ghoul\b/Glabbagool/g;
$t =~ s/\bGlobagool\b/Glabbagool/g;
$t =~ s/\bGlobbable\b/Glabbagool/g;
$t =~ s/\bBabagle\b/Glabbagool/g;
$t =~ s/\bGlavagool\b/Glabbagool/gi;
$t =~ s/\bGlavagoul\b/Glabbagool/gi;
$t =~ s/\bGlobagoul\b/Glabbagool/g;
$t =~ s/\bGlabagul\b/Glabbagool/g;
$t =~ s/\bGlabagool\b/Glabbagool/g;

# Shuushar
$t =~ s/\bShoe shark\b/Shuushar/g;
$t =~ s/\bShoe Shark\b/Shuushar/g;

# chuul (ambush monster) - all in-transcript jewel/tool/troll/shul/chul refer to the chuul
$t =~ s/\bjewel\b/chuul/g;
$t =~ s/\btools\b/chuuls/g;
$t =~ s/\btool\b/chuul/g;
$t =~ s/\btroll\b/chuul/g;
$t =~ s/\bshul\b/chuul/g;
$t =~ s/\bshul's\b/chuul's/g;
$t =~ s/\bchul\b/chuul/g;
$t =~ s/\bchull\b/chuul/g;

# carrion crawler
$t =~ s/\bcarrying crawler\b/carrion crawler/g;

# Zurkhwood
$t =~ s/\bberserk wood\b/Zurkhwood/g;

# Lolth
$t =~ s/\blolth\b/Lolth/g;
$t =~ s/\bLoth\b/Lolth/g;

# Topsy
$t =~ s/\btop scenes\b/Topsy/g;
$t =~ s/\btossy\b/Topsy/gi;

# Aeolus - distinctive variants global; "a list" handled as targeted phrases below
$t =~ s/\bAlis\b/Aeolus/g;
$t =~ s/\bAlice\b/Aeolus/g;
$t =~ s/\bAyla\b/Aeolus/g;
$t =~ s/\bAaylis\b/Aeolus/g;
$t =~ s/you are up a list\./you are up, Aeolus./g;
$t =~ s/bring us to a list\./bring us to Aeolus./g;
$t =~ s/go to a list\b/go to Aeolus/g;
$t =~ s/\. a list\. What was your Arcana/. Aeolus. What was your Arcana/g;

# Amanita
$t =~ s/\bAmani\b/Amanita/g;

# myconid - targeted phrases
$t =~ s/\bMike and his sprout\b/myconid sprout/g;
$t =~ s/\bmic in it\b/myconid/g;
$t =~ s/\bmicnib\b/myconid/g;

# mycelial network
$t =~ s/\bmy Celial network\b/mycelial network/g;

# Halo of Spores
$t =~ s/\bhalo spores\b/Halo of Spores/g;

# Constitution saving throw
$t =~ s/\bInstitution saving throw\b/Constitution saving throw/g;

# Darklake
$t =~ s/\bdark lake\b/Darklake/gi;

# War Caster (targeted)
$t =~ s/\bMore caster\b/War Caster/g;

# 1 HP (targeted)
$t =~ s/\bone gp\b/1 HP/g;

# faerzress
$t =~ s/\bFerris whis\b/faerzress/g;

# Garl Glittergold
$t =~ s/\bGarled glitter gold\b/Garl Glittergold/g;

# Pterostor
$t =~ s/\bterroristor\b/Pterostor/g;

# Jorlan Duskryn
$t =~ s/\bJorlyn\b/Jorlan Duskryn/g;

# ---- Speaker label mapping (participant -> character / DM) ----
$t =~ s/\bSPEAKER A:/ADDISON (DM):/g;
$t =~ s/\bSPEAKER B:/KIT:/g;
$t =~ s/\bSPEAKER C:/BLARG:/g;
$t =~ s/\bSPEAKER D:/BINKS:/g;
$t =~ s/\bSPEAKER E:/AMANITA:/g;
$t =~ s/\bSPEAKER F:/AEOLUS:/g;
$t =~ s/\bSPEAKER G:/DARBY:/g;

print $t;
