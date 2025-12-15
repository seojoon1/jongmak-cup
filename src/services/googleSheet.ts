import Papa from 'papaparse';
import type { Player } from '../types';

export const fetchPlayersFromSheet = async (sheetUrl: string): Promise<Player[]> => {
  try {
    console.log("Fetching sheet with updated logic...");
    let csvUrl = sheetUrl;

    if (sheetUrl.includes('output=csv') || sheetUrl.includes('format=csv')) {
      csvUrl = sheetUrl;
    } else if (sheetUrl.includes('/edit')) {
      const match = sheetUrl.match(/\/d\/(.*?)(\/|$)/);
      if (match) {
        // gid가 있는 경우 유지하도록 처리 (선택적)
        const gidMatch = sheetUrl.match(/gid=(\d+)/);
        const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
        csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv${gidParam}`;
      }
    } else if (sheetUrl.includes('/pubhtml')) {
        csvUrl = sheetUrl.replace('/pubhtml', '/pub?output=csv');
    }

    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false, // 헤더 위치를 모르므로 false로 설정하여 전체를 배열로 받음
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];
          
          // 1. 헤더 행 찾기 ("닉네임" 또는 "Name"이 포함된 행)
          const headerRowIndex = rows.findIndex(row => 
            row.some(cell => cell && (cell.includes('닉네임') || cell.includes('Name')))
          );

          if (headerRowIndex === -1) {
            console.error("Header row not found (닉네임/Name 컬럼을 찾을 수 없습니다)");
            resolve([]); 
            return;
          }

          const headerRow = rows[headerRowIndex];
          
          // 2. 컬럼 인덱스 매핑
          const getColIndex = (keywords: string[]) => 
            headerRow.findIndex(cell => 
              cell && keywords.some(k => cell.includes(k))
            );

          const idxName = getColIndex(['닉네임', 'Name', 'name']);
          const idxIngame = getColIndex(['롤 계정', '롤계정', 'IngameName', 'Ign']);
          const idxPos = getColIndex(['포지션', 'Position', 'position']);
          const idxTier = getColIndex(['티어', 'Tier', 'tier']);
          const idxMost = getColIndex(['주챔', '모스트', 'Most']);

          // 3. 데이터 추출 (헤더 다음 행부터 시작)
          const players: Player[] = [];
          
          for (let i = headerRowIndex + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            // 필수 값인 닉네임이 없으면 스킵
            const name = idxName !== -1 ? row[idxName] : '';
            if (!name || name.trim() === '') continue;

            const ingameName = idxIngame !== -1 ? row[idxIngame] : name;
            let positionRaw = idxPos !== -1 ? row[idxPos] : 'MID';
            const tier = idxTier !== -1 ? row[idxTier] : 'Unranked';
            
            // 5. 주챔 처리 (확실하게 첫 번째 것만 가져오기)
            const mostRaw = idxMost !== -1 ? row[idxMost] : '';
            let mostChampions = mostRaw;

            if (mostChampions) {
                // 1. 콤마(,)가 있으면 앞부분만 취함
                if (mostChampions.includes(',')) {
                    mostChampions = mostChampions.split(',')[0];
                }
                // 2. 슬래시(/)가 있으면 앞부분만 취함
                if (mostChampions.includes('/')) {
                    mostChampions = mostChampions.split('/')[0];
                }
                // 3. 공백 제거
                mostChampions = mostChampions.trim();
            }

            players.push({
              id: `p-${i}`,
              name: name.trim(),
              ingameName: ingameName.trim(),
              position: positionRaw.toUpperCase().trim(),
              tier: tier.trim(),
              mostChampions: mostChampions
            });
          }

          console.log(`Parsed ${players.length} players from row ${headerRowIndex + 1}`);
          resolve(players);
        },
        error: (err: any) => reject(err),
      });
    });
  } catch (error) {
    console.error("Failed to fetch sheet", error);
    alert("시트를 불러오는데 실패했습니다. 링크 권한이 '웹에 게시' 상태인지 확인해주세요.");
    return [];
  }
};