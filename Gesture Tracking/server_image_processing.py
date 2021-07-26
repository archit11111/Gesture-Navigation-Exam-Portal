import cv2
import dlib 
import numpy as np
import base64
from imutils import face_utils


from POI import *
from get_eye_ratio import get_eye_aspect_ratio
from get_mouth_ratio import get_mouth_ratio


class server_image_processing(object):
    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")


    def data_uri_to_cv2_img(self, uri):
        encoded_data = uri.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img


    def get_head_pose(self, shape):
        '''
        These are the array of 2D points (image points) that we are tracking
        '''
        image_pts = np.float32([shape[17], shape[21], # left eyebrow end points
                                shape[22], shape[26], # right eyebrow end points
                                shape[36], shape[39], # left and right end points of left eye
                                shape[42], shape[45], # left and right end points of right eye
                                shape[31], shape[35], # end points of the nose tip
                                shape[48], shape[54], # left and right end points of the mouth
                                shape[57],            # bottom of the mouth
                                shape[8]]             # bottom of the chin
                                )

        success, rotation_vec, translation_vec = cv2.solvePnP(object_pts, image_pts, cam_matrix, dist_coeffs)

        # converts rotaion matrix to rotation vector using rodrigues transformation
        rotation_mat, _ = cv2.Rodrigues(rotation_vec)

        pose_mat = cv2.hconcat((rotation_mat, translation_vec))
        _, _, _, _, _, _, euler_angle = cv2.decomposeProjectionMatrix(pose_mat)

        return euler_angle

    def process_image(self, data_uri):
        tresh_head = 10
        EYE_AR_THRESH = 0.2

        (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
        (mStart, mEnd) = face_utils.FACIAL_LANDMARKS_IDXS['mouth']

        frame = self.data_uri_to_cv2_img(data_uri)
        frame = cv2.flip(frame, 1)
        
        face_rects = self.detector(frame, 0)
        if not face_rects:
            return ({'direction':None})
        
        face = face_rects[0]
        shape = self.predictor(frame, face)
        shape = face_utils.shape_to_np(shape)

        # leftEye = shape[lStart:lEnd]
        # rightEye = shape[rStart:rEnd]
        # leftEAR = get_eye_aspect_ratio(leftEye)
        # rightEAR = get_eye_aspect_ratio(rightEye)
        # ear = (leftEAR + rightEAR) / 2.0
        
        mouth = shape[mStart:mEnd]
        MAR = get_mouth_ratio(mouth)

        
        euler_angle = self.get_head_pose(shape)
        X = euler_angle[0, 0]
        Y = -euler_angle[1, 0]


        if MAR > 0.55:
            return ({'direction':'click'}) #pyautogui.click()
        
        if  float(X) > (tresh_head-3):
            return ({'direction': 'down'}) #pyautogui.moveRel(0,1 * int(X))

        if  float(X) < -(tresh_head-3):
            return ({'direction': 'up'}) #pyautogui.moveRel(0,-1 * int(-X))

        if  float(Y) > tresh_head:
            return ({'direction': 'right'}) #pyautogui.moveRel(1 * int(Y) ,0)

        if  float(Y) < -tresh_head:
            return ({'direction': 'left'}) #pyautogui.moveRel(-1 * int(-Y) ,0)

        return ({'direction':None})

