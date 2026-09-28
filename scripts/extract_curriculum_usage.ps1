[CmdletBinding()]
param (
    [string]$FilePath = "C:\Users\AhmedMahdy\Downloads\WordPix_Complete_Curriculum_Final_Revised.xlsx",
    [string]$UnitFilter = "farm",
    [string]$OutputDir = "src/app/data/usage"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

if (-not (Test-Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit 1
}

Write-Host "Opening workbook: $FilePath"
$zip = [System.IO.Compression.ZipFile]::OpenRead($FilePath)

# 1. Parse Usage_Scenes block into structured chunks
function Parse-UsageScenes($rawText, $imageBriefsText, $lessonId) {
    if (-not $rawText) { return @() }
    
    # Parse image briefs by chunk index
    $briefMap = @{}
    if ($imageBriefsText) {
        $briefMatches = [regex]::Matches($imageBriefsText, "(?m)^$lessonId-usage-(\d+):\s*(.+)$")
        foreach ($bm in $briefMatches) {
            $briefMap[[int]$bm.Groups[1].Value] = $bm.Groups[2].Value.Trim()
        }
    }

    $chunks = @()
    $chunkRegex = '(?ms)Chunk\s+(\d+)\s*[-—–]\s*([^\r\n]+)\r?\n(.*?)(?=(?:\r?\nChunk\s+\d+\s*[-—–]|\z))'
    $cMatches = [regex]::Matches($rawText, $chunkRegex)
    
    foreach ($cm in $cMatches) {
        $chunkNum = [int]$cm.Groups[1].Value
        $wordsHeader = $cm.Groups[2].Value.Trim()
        $body = $cm.Groups[3].Value.Trim()
        
        $words = $wordsHeader -split '\s*\|\s*' | ForEach-Object { $_.Trim() }
        
        $scenario = $body
        $checkQ = ""
        $checkA = ""
        
        if ($body -match '(?s)(.*?)\r?\nCheck:\s*(.+?)\s*\((.+?)\)\s*$') {
            $scenario = $matches[1].Trim()
            $checkQ = $matches[2].Trim()
            $checkA = $matches[3].Trim()
        }
        
        $brief = if ($briefMap.ContainsKey($chunkNum)) { $briefMap[$chunkNum] } else { "" }
        
        # Options for the check: the target words in this chunk
        $options = $words
        
        $chunks += [PSCustomObject]@{
            chunkNumber = $chunkNum
            targetWords = $words
            scenario = $scenario
            check = [PSCustomObject]@{
                question = $checkQ
                options = $options
                expectedAnswer = $checkA
            }
            imageBrief = $brief
        }
    }
    return $chunks
}

# 2. Parse Exercises block
function Parse-Exercises($rawText) {
    if (-not $rawText) { return @() }
    $exercises = @()
    $lines = $rawText -split "`r?`n"
    foreach ($line in $lines) {
        $l = $line.Trim()
        if (-not $l) { continue }
        $clean = $l -replace '^[•\-\*]\s*', ''
        if ($clean -match '^(.+?)\s*\|\s*Answer:\s*(.+)$') {
            $exercises += [PSCustomObject]@{
                prompt = $matches[1].Trim()
                answer = $matches[2].Trim()
            }
        } else {
            $exercises += [PSCustomObject]@{
                prompt = $clean
                answer = ""
            }
        }
    }
    return $exercises
}

# 3. Scan sheet2.xml for lessons
$entry = $zip.GetEntry("xl/worksheets/sheet2.xml")
$stream = $entry.Open()
$reader = [System.Xml.XmlReader]::Create($stream)

$lessons = @()
$r = 0
$currentRow = [ordered]@{}

Write-Host "Reading curriculum sheet..."
while ($reader.Read()) {
    if ($reader.NodeType -eq [System.Xml.XmlNodeType]::Element) {
        if ($reader.LocalName -eq "row") {
            $r = [int]$reader.GetAttribute("r")
            $currentRow = [ordered]@{}
        }
        elseif ($reader.LocalName -eq "c") {
            $cellRef = $reader.GetAttribute("r")
        }
        elseif ($reader.LocalName -eq "v") {
            $colLetter = $cellRef -replace '\d+',''
            $currentRow[$colLetter] = $reader.ReadElementContentAsString()
        }
    }
    elseif ($reader.NodeType -eq [System.Xml.XmlNodeType]::EndElement -and $reader.LocalName -eq "row") {
        if ($r -gt 1) {
            $lessonId = $currentRow["G"]
            $unitName = $currentRow["E"]
            
            # Determine unit slug
            $unitSlug = ""
            if ($lessonId -match '^(.+)-\d+$') {
                $unitSlug = $matches[1]
            }

            $matchesFilter = $true
            if ($UnitFilter -and $UnitFilter -ne "all") {
                $matchesFilter = ($unitSlug -eq $UnitFilter) -or ($unitName -like "*$UnitFilter*")
            }

            if ($matchesFilter -and $lessonId) {
                $usageScenes = Parse-UsageScenes $currentRow["P"] $currentRow["T"] $lessonId
                
                # Reading brief
                $readingBrief = ""
                if ($currentRow["T"] -match "(?m)^$lessonId-reading:\s*(.+)$") {
                    $readingBrief = $matches[1].Trim()
                }

                $exercises = Parse-Exercises $currentRow["S"]
                
                $engWords = if ($currentRow["J"]) { ($currentRow["J"] -split ',\s*') | ForEach-Object { $_.Trim() } } else { @() }
                $arWords = if ($currentRow["K"]) { ($currentRow["K"] -split ',\s*') | ForEach-Object { $_.Trim() } } else { @() }

                $lessonObj = [PSCustomObject]@{
                    lessonId = $lessonId
                    lessonName = $currentRow["H"]
                    unitId = $unitSlug
                    unitName = $unitName
                    unitOrder = [int]$currentRow["D"]
                    lessonOrderInUnit = [int]$currentRow["F"]
                    globalOrder = [int]$currentRow["C"]
                    cefrStage = $currentRow["A"]
                    stageName = $currentRow["B"]
                    targetWordsEnglish = $engWords
                    targetWordsArabic = $arWords
                    usage = [PSCustomObject]@{
                        goal = $currentRow["L"]
                        canDoStatement = $currentRow["M"]
                        textType = $currentRow["N"]
                        readingTarget = $currentRow["O"]
                        scenes = $usageScenes
                    }
                    reading = [PSCustomObject]@{
                        title = $currentRow["Q"]
                        text = $currentRow["R"]
                        imageBrief = $readingBrief
                    }
                    exercises = $exercises
                    video = [PSCustomObject]@{
                        title = $currentRow["V"]
                        idea = $currentRow["W"]
                        scriptStarter = $currentRow["X"]
                    }
                    spacedReview = $currentRow["Y"]
                }
                $lessons += $lessonObj
            }
        }
    }
}

$reader.Close()
$stream.Close()
$zip.Dispose()

Write-Host "`nExtracted $($lessons.Count) lessons matching filter '$UnitFilter'."

if ($lessons.Count -gt 0) {
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }

    # Group by unitId and export JSON
    $grouped = $lessons | Group-Object -Property unitId
    foreach ($grp in $grouped) {
        if (-not $grp.Name) { continue }
        $outPath = Join-Path $OutputDir "$($grp.Name).usage.json"
        $json = $grp.Group | ConvertTo-Json -Depth 10
        [System.IO.File]::WriteAllText($outPath, $json, [System.Text.Encoding]::UTF8)
        Write-Host "Exported unit '$($grp.Name)' ($($grp.Count) lessons) -> $outPath"
    }
}
