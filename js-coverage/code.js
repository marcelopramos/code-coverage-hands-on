function shouldIDeployOn(dayOfWeek) {
    if (dayOfWeek == 'Friday') {
        return "How about Monday?";
    } else {
        return "Yes";
    }
}

function shouldIWatchThisMovie(movie) {
    if (movie == 'Joker') {
        return "What about Twilight...?";
    } else {
        return "Yes";
    }
}

module.exports = { shouldIDeployOn, shouldIWatchThisMovie };