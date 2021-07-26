import time
import cv2
import dlib
import numpy as np
from imutils import face_utils
import pyautogui


from POI import *
from get_eye_ratio import get_eye_aspect_ratio
from get_mouth_ratio import get_mouth_ratio


# The pre-trained dlib model with 68 facial landmark features
face_landmark_path = 'shape_predictor_68_face_landmarks.dat'


def get_head_pose(shape):
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


 
def main():

    tresh_head = 12
    EYE_AR_THRESH = 0.2

    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
    (mStart, mEnd) = face_utils.FACIAL_LANDMARKS_IDXS['mouth']
    # print(lStart, lEnd)
    # print(rStart, rEnd)
    # print(mStart, mEnd)
    cap = cv2.VideoCapture(0)

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(face_landmark_path)
    
    while cap.isOpened():

        global frame
        ret, frame = cap.read()
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        frame = cv2.flip(frame,1)
        if ret:
            face_rects = detector(frame, 0)

            if len(face_rects) > 0:
                for faces in face_rects:
                    shape = predictor(frame, faces)
                    shape = face_utils.shape_to_np(shape)
                    for (x, y) in shape:
                        cv2.circle(frame, (x, y), 1, (0, 255, 255), -1)
                        
                    
                    # leftEye = shape[lStart:lEnd]
                    # rightEye = shape[rStart:rEnd]
                    # leftEAR = get_eye_aspect_ratio(leftEye)
                    # rightEAR = get_eye_aspect_ratio(rightEye)
                    # cv2.putText(frame, str(rightEAR - leftEAR), (50,90), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 3) 
                    mouth = shape[mStart:mEnd]
                    MAR = get_mouth_ratio(mouth)
                    
                    # cv2.circle(frame, mouth[0], 1, (255, 0, 255), -1)
                    # cv2.circle(frame, mouth[6], 1, (255, 0, 255), -1)
                    cv2.putText(frame, str(round(MAR,5)), (50,90), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 3) 

                    euler_angle = get_head_pose(shape)
                    X = euler_angle[0, 0]
                    Y = -euler_angle[1, 0]

                    
                    if MAR > 0.55: 
                        pyautogui.click()
                        # time.sleep(0.3)

                    if  float(X) > (tresh_head-3):
                        cv2.putText(frame, 'down', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0,255,0), 3) 
                        pyautogui.moveRel(0,2 * int(X))

                    if  float(X) < -(tresh_head-3):
                        cv2.putText(frame, 'up', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0,255,0), 3) 
                        pyautogui.moveRel(0,-2 * int(-X))

                    if  float(Y) > tresh_head:
                        cv2.putText(frame, 'right', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0,255,0), 3) 
                        pyautogui.moveRel(2 * int(Y) ,0)

                    if  float(Y) < -tresh_head:
                        cv2.putText(frame, 'left', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0,255,0), 3) 
                        pyautogui.moveRel(-2 * int(-Y) ,0)

            cv2.imshow("Frame", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): 
                break


if __name__ == '__main__':
    main()
