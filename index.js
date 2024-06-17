import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline-sync';

function getData(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

// Function to create the desired body data from query string
async function getAuthUser(token, returnJson = true) {
    const options = {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'sec-ch-ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'origin': 'https://galaxywallet.xyz',
            'sec-fetch-site': 'same-origin',
          },
        body: JSON.stringify({ "init_data": token })
    };

    try {
        const response = await fetch('https://galaxywallet.xyz/api/get_user_info', options);
        const data = returnJson ? await response.json() : await response.text();
        return data;
    } catch (error) {
        console.log('Error fetching auth token:', error);
        return null;
    }
}

async function authenticate(token, returnJson = true) {
    const options = {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'sec-ch-ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'origin': 'https://galaxywallet.xyz',
            'sec-fetch-site': 'same-origin',
          },
        body: JSON.stringify({ "init_data": initdata })
    };

    try {
        const response = await fetch('https://api.hamsterkombat.io/auth/me-telegram', options);
        const data = returnJson ? await response.json() : await response.text();
        return data;
    } catch (error) {
        console.error('Error authenticating:', error);
        return null;
    }
}

async function claimGalaxy(token) {
    const options = {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'sec-ch-ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24", "Microsoft Edge WebView2";v="125"',
            'sec-ch-ua-mobile': '?0',
            'authorization': 'Bearer ' + token,
            'sec-ch-ua-platform': '"Windows"',
            'origin': 'https://galaxywallet.xyz',
            'accept-language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7'
        },
        body: JSON.stringify({})
    };

    try {
        const response = await fetch('https://galaxywallet.xyz/api/claim', options);
        const contentType = response.headers.get('content-type');
        
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
            try {
                data = JSON.parse(data);
            } catch (e) {
                // Jika teks tidak bisa di-parse sebagai JSON, biarkan tetap sebagai teks
            }
        }

        return data;
    } catch (error) {
        console.error('Error authenticating:', error);
        return null;
    }
}


function convertDetikToJamMenit(detik) {
    // Menghitung jumlah jam dari detik
    var jam = Math.floor(detik / 3600);
    var sisaDetik = detik % 3600;
    var menit = Math.floor(sisaDetik / 60);
    var detikSisa = sisaDetik % 60;
    var hasil = jam.toString().padStart(2, '') + ' JAM - ' + menit.toString().padStart(2, '') + ' MENIT - ' + detikSisa.toString().padStart(2, '') + ' DETIK';

    return hasil;
}

function numberFormat(number, decimals = 0, decPoint = ',', thousandsSep = '.') {
    const n = parseFloat(number).toFixed(decimals);
    const parts = n.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
}

(async () => {
    // getData
    const dataList = getData('dataAkun.txt');
    
    console.log(`------------------------------`);
    console.log(` |          MENU            | `);
    console.log(` [   GALAXY.BOT AUTO CLAIM  ] `);
    console.log(`------------------------------`);
    console.log(`         DIMOHON UNTUK        `);
    console.log(`    TIDAK DIPERJUAL BELIKAN   `);
    console.log(`------------------------------`);
    console.log();

    const delayInput = parseInt(readline.question("[!] MASUKKAN DELAY (dalam detik)  : "));
    if (isNaN(delayInput)) {
        console.log("MASUKKAN DATA YANG BENAR!! HANYA ISI DENGAN ANGKA SAJA!!");
        process.exit(0);
    }

    const delayInMillis = delayInput * 1000;
    const minutes = Math.floor(delayInput / 60);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    console.log('[.] MENJALANKAN AUTO TAP.TAP PADA ' + dataList.length + ' AKUN...\n');
    while (true) {
        for (let i = 0; i < dataList.length; i += 1000) {
            const batch = dataList.slice(i, i + 1000);
            const batchPromises = batch.map(async (token, batchIndex) => {
                const no = i + batchIndex + 1;
                let logMessage = `[${getCurrentTime()}].[[#${no}] ID.TG: `;
                const getDataQuery = await getAuthUser(token, false);
                const dataAkun = JSON.parse(getDataQuery);
                
                    if (dataAkun && dataAkun.status !== null) {
                        const { telegram_id, bnb_balance, galaxy_balance, deposit_address, last_claim, spaceship_level, astronaut_level, planet_level, countdown } = dataAkun.user;
                        const { auth_token } = dataAkun;
                        let bnbFormatGalaxy = "0.00000000";
                        let banyakangkabnb = bnb_balance.toString();
                        let itungBnaykangka = banyakangkabnb.length;
                        let ballance_BNB = bnb_balance.toString().padStart(itungBnaykangka, '0');
                        let ballanceBNB = bnbFormatGalaxy.slice(0, -itungBnaykangka) + ballance_BNB;

                        logMessage += `${telegram_id} ] Address: ${deposit_address} | Balance: [ ${ballanceBNB} BNB | ${galaxy_balance/100000000} GALAXY ] | SPACESHIP.Lv: ${spaceship_level} | ASTRONOUT.Lv: ${astronaut_level} | PLANET.Lv: ${planet_level}\n`;
                        
                        if (countdown === 0) {
                        const galaxyClaim = await claimGalaxy(auth_token);
                        if (galaxyClaim.success === true) {
                            let bnbFormatGalaxy = "0.00000000";
                            let banyakangkabnb = galaxyClaim.user.bnb_balance.toString();
                            let itungBnaykangka = banyakangkabnb.length;
                            let ballance_BNBAfter = galaxyClaim.user.bnb_balance.toString().padStart(itungBnaykangka, '0');
                            let ballanceBNBAfter = bnbFormatGalaxy.slice(0, -itungBnaykangka) + ballance_BNBAfter;
                            let ballanceGALAXYAfter = galaxyClaim.user.galaxy_balance;
                        
                            logMessage += `=> STATUS CLAIM: BERHASIL!! After Balance: [ ${ballanceBNBAfter} BNB | ${ballanceGALAXYAfter / 100000000} GALAXY ]\n`;
                        } else if (galaxyClaim === 'Not enough transaction fees') {
                            logMessage += `=> STATUS CLAIM: BNB FEE TIDAK CUKUP!!\n`;
                        } else{
                            logMessage += `=> STATUS CLAIM: MSG: ${galaxyClaim}!!\n`;
                        }
                    }else{
                        var waktuClaimDelay = convertDetikToJamMenit(countdown);
                        logMessage += `=> STATUS CLAIM: BELUM WAKTUNYA CLAIM!! TERSISA ${waktuClaimDelay}\n`;
                    }
                        
                }
                console.log(logMessage);
            });
            await Promise.all(batchPromises);
        }
        console.log(`[${getCurrentTime()}] SEMUA AKUN BERHASIL DICLAIM. DELAY ${minutes} MENIT...`);
        await delay(delayInMillis);
        console.clear();
        console.log(`[${getCurrentTime()}] MEMULAI AUTO CLAIM ${dataList.length} AKUN...\n`);
    }
})();

function getCurrentTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const timeFormatter = new Intl.DateTimeFormat('en-GB', options);
    const timeParts = timeFormatter.formatToParts(now);

    const hours = timeParts.find(part => part.type === 'hour').value;
    const minutes = timeParts.find(part => part.type === 'minute').value;
    const seconds = timeParts.find(part => part.type === 'second').value;

    return `${hours}:${minutes}:${seconds}`;
}
