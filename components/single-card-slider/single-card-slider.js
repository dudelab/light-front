function getTimeRemaining(targetDate) {
    const now = new Date();
    const target = new Date(targetDate.split('/').reverse().join('-') + 'T00:00:00');
    const timeDiff = target - now;

    if (timeDiff <= 0) {
        return { days: 0, hours: 0, minutes: 0, expired: true };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
}

// Esempio d'uso con la data del JSON
const jsonData = {
    "cards": [
        {
            "time": "13/02/2025"
        }
    ]
};

const countdown = getTimeRemaining(jsonData.cards[0].time);
console.log(`Mancano ${countdown.days} giorni, ${countdown.hours} ore e ${countdown.minutes} minuti.`);
