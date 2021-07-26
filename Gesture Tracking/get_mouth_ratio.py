from scipy.spatial import distance as dist

def get_mouth_ratio(mouth):
    horizontal_dist = dist.euclidean(mouth[0], mouth[6])
    vertical_dist = dist.euclidean(mouth[3], mouth[9])

    ratio = vertical_dist / horizontal_dist

    return ratio
