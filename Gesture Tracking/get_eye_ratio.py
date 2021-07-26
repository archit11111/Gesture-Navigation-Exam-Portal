from scipy.spatial import distance as dist

def get_eye_aspect_ratio(eye):
	A = dist.euclidean(eye[1], eye[5])
	B = dist.euclidean(eye[2], eye[4])

	C = dist.euclidean(eye[0], eye[3])


	ear = (A + B) / (2.0)

	return ear
