$ErrorActionPreference = 'Stop'
$src = 'Session_Sources/Transcripts/Raw_Unedited/16-060726_raw_transcript.md'
$dst = 'Session_Sources/Transcripts/Corrected/16 - 060726_corrected.md'
$t = Get-Content -Raw -Encoding UTF8 $src

# ---- Approved proper-noun corrections (word-boundary) ----
# Derendil
$t = $t -creplace '\bDarren Dill\b','Derendil'
$t = $t -creplace '\bDarren Dell\b','Derendil'
$t = $t -creplace '\bDarren dell\b','Derendil'
$t = $t -creplace '\bDarren Doe\b','Derendil'
$t = $t -creplace '\bDarren Dole\b','Derendil'
$t = $t -creplace '\bDarren Deal\b','Derendil'
$t = $t -creplace '\bDarrendil\b','Derendil'
$t = $t -creplace '\bDarendyl\b','Derendil'
$t = $t -creplace '\bDirendyl\b','Derendil'
$t = $t -creplace '\bDarindil\b','Derendil'
$t = $t -creplace '\bDurandal\b','Derendil'
$t = $t -creplace '\bDaredevil\b','Derendil'
$t = $t -creplace '\bDarendale\b','Derendil'
$t = $t -creplace '\bArendelle\b','Derendil'
$t = $t -creplace '\bDarrenil\b','Derendil'
$t = $t -creplace '\bDharndil\b','Derendil'
$t = $t -creplace '\bDarrenville\b','Derendil'

# quaggoth(s)
$t = $t -creplace '\bQuagoths\b','quaggoths'
$t = $t -creplace '\bQuagoth\b','quaggoth'
$t = $t -creplace '\bquag offs\b','quaggoths'
$t = $t -creplace '\bquag off\b','quaggoth'
$t = $t -creplace '\bquag-off\b','quaggoth'
$t = $t -creplace '\bAgarth\b','quaggoth'

# kuo-toa
$t = $t -creplace '\bKuo Toa\b','kuo-toa'
$t = $t -creplace '\bKuo-Toa\b','kuo-toa'
$t = $t -creplace '\bQuator\b','kuo-toa'
$t = $t -creplace '\bkuoa\b','kuo-toa'
$t = $t -creplace '\bkwicha\b','kuo-toa'

# Velkynvelve
$t = $t -creplace '\bVelkan valve\b','Velkynvelve'
$t = $t -creplace '\bVulcan Valve\b','Velkynvelve'
$t = $t -creplace '\bVulcan valve\b','Velkynvelve'
$t = $t -creplace '\bBelkinbel\b','Velkynvelve'
$t = $t -creplace '\bVulcan\b','Velkynvelve'

# Sloobludop (location)
$t = $t -creplace '\bSloople Dob\b','Sloobludop'
$t = $t -creplace '\bSloopla Dot\b','Sloobludop'
$t = $t -creplace '\bSlupadab\b','Sloobludop'
$t = $t -creplace '\bSlupada\b','Sloobludop'
$t = $t -creplace '\bLuplada\b','Sloobludop'

# Sloopidoop (NPC)
$t = $t -creplace '\bSnoopy Doop\b','Sloopidoop'
$t = $t -creplace '\bSwoop a doop\b','Sloopidoop'
$t = $t -ireplace '\bSloop a dupe\b','Sloopidoop'
$t = $t -creplace '\bSloopadoop\b','Sloopidoop'
$t = $t -creplace '\bSloopadoo\b','Sloopidoop'
$t = $t -creplace '\bloop a dupe\b','Sloopidoop'
$t = $t -creplace '\bslip a dupe\b','Sloopidoop'
$t = $t -creplace '\bslipper dupe\b','Sloopidoop'
$t = $t -creplace '\bFlippy Dupe\b','Sloopidoop'
$t = $t -creplace '\bFlippy Doop\b','Sloopidoop'
$t = $t -ireplace '\bsuper dupe\b','Sloopidoop'
$t = $t -ireplace '\bsuper dup\b','Sloopidoop'

# Glabbagool
$t = $t -ireplace '\bglad of ghoul\b','Glabbagool'
$t = $t -creplace '\bGlobagool\b','Glabbagool'
$t = $t -creplace '\bGlobbable\b','Glabbagool'
$t = $t -creplace '\bBabagle\b','Glabbagool'
$t = $t -ireplace '\bGlavagool\b','Glabbagool'
$t = $t -ireplace '\bGlavagoul\b','Glabbagool'
$t = $t -creplace '\bGlobagoul\b','Glabbagool'
$t = $t -creplace '\bGlabagul\b','Glabbagool'
$t = $t -creplace '\bGlabagool\b','Glabbagool'

# Shuushar
$t = $t -ireplace '\bShoe shark\b','Shuushar'

# chuul (ambush monster)
$t = $t -creplace '\bjewel\b','chuul'
$t = $t -creplace '\btools\b','chuuls'
$t = $t -creplace '\btool\b','chuul'
$t = $t -creplace '\btroll\b','chuul'
$t = $t -creplace "\bshul's\b","chuul's"
$t = $t -creplace '\bshul\b','chuul'
$t = $t -creplace '\bchul\b','chuul'
$t = $t -creplace '\bchull\b','chuul'

# carrion crawler
$t = $t -ireplace '\bcarrying crawler\b','carrion crawler'

# Zurkhwood
$t = $t -ireplace '\bberserk wood\b','Zurkhwood'

# Lolth
$t = $t -creplace '\blolth\b','Lolth'
$t = $t -creplace '\bLoth\b','Lolth'

# Topsy
$t = $t -ireplace '\btop scenes\b','Topsy'
$t = $t -ireplace '\btossy\b','Topsy'

# Aeolus
$t = $t -creplace '\bAlis\b','Aeolus'
$t = $t -creplace '\bAlice\b','Aeolus'
$t = $t -creplace '\bAyla\b','Aeolus'
$t = $t -creplace '\bAaylis\b','Aeolus'
$t = $t -creplace 'you are up a list\.','you are up, Aeolus.'
$t = $t -creplace '\. a list\. What was your Arcana','. Aeolus. What was your Arcana'

# Amanita
$t = $t -creplace '\bAmani\b','Amanita'

# myconid
$t = $t -ireplace '\bMike and his sprout\b','myconid sprout'
$t = $t -ireplace '\bmic in it\b','myconid'
$t = $t -ireplace '\bmicnib\b','myconid'

# mycelial network
$t = $t -ireplace '\bmy Celial network\b','mycelial network'

# Halo of Spores
$t = $t -ireplace '\bhalo spores\b','Halo of Spores'

# Constitution saving throw
$t = $t -ireplace '\bInstitution saving throw\b','Constitution saving throw'

# Darklake
$t = $t -ireplace '\bdark lake\b','Darklake'

# War Caster
$t = $t -creplace '\bMore caster\b','War Caster'

# 1 HP
$t = $t -ireplace '\bone gp\b','1 HP'

# faerzress
$t = $t -ireplace '\bFerris whis\b','faerzress'

# Garl Glittergold
$t = $t -ireplace '\bGarled glitter gold\b','Garl Glittergold'

# Pterostor
$t = $t -ireplace '\bterroristor\b','Pterostor'

# Jorlan Duskryn
$t = $t -creplace '\bJorlyn\b','Jorlan Duskryn'

# ---- Speaker label mapping ----
$t = $t -creplace '\bSPEAKER A:','ADDISON (DM):'
$t = $t -creplace '\bSPEAKER B:','KIT:'
$t = $t -creplace '\bSPEAKER C:','BLARG:'
$t = $t -creplace '\bSPEAKER D:','BINKS:'
$t = $t -creplace '\bSPEAKER E:','AMANITA:'
$t = $t -creplace '\bSPEAKER F:','AEOLUS:'
$t = $t -creplace '\bSPEAKER G:','DARBY:'

Set-Content -Path $dst -Value $t -Encoding UTF8 -NoNewline

# Verification output
Write-Output ('Stool occurrences: ' + ([regex]::Matches($t,'(?i)\bstool\b')).Count)
Write-Output ('stray bare tool: ' + ([regex]::Matches($t,'\btool\b')).Count)
Write-Output ('stray jewel: ' + ([regex]::Matches($t,'\bjewel\b')).Count)
Write-Output ('stray Darren: ' + ([regex]::Matches($t,'Darren')).Count)
Write-Output ('Derendil: ' + ([regex]::Matches($t,'Derendil')).Count)
Write-Output ('Sloopidoop: ' + ([regex]::Matches($t,'Sloopidoop')).Count)
Write-Output ('Sloobludop: ' + ([regex]::Matches($t,'Sloobludop')).Count)
Write-Output ('chuul: ' + ([regex]::Matches($t,'chuul')).Count)
Write-Output ('Velkynvelve: ' + ([regex]::Matches($t,'Velkynvelve')).Count)
Write-Output ('SPEAKER left: ' + ([regex]::Matches($t,'SPEAKER [A-G]:')).Count)
