PEAK_HOURS = {
    0: [(11,13),(17,19)],
    1: [(11,13),(17,19)],
    2: [(11,13),(17,19)],
    3: [(11,13),(17,19)],
    4: [(11,13),(17,19)],
    5: [(9,11),(14,16)],
    6: [(9,11),(14,16)]
}


def is_peak_hour(hour, day):

    if day not in PEAK_HOURS:
        return False

    for start,end in PEAK_HOURS[day]:

        if start <= hour < end:
            return True

    return False


def peak_intensity(hour,day):

    if not is_peak_hour(hour,day):
        return 0

    return 1