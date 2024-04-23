import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Accordian ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")

    video_elements = slide_container.find_elements(By.XPATH, "//video")
    # Check Slide Type is Matching
    if len(video_elements) == 0:
        return False, ''
    
    scorm_slide = {'type': 'video', 'data': {'src': ''}}

    header_text = ''
    section_text = ''
    if len(video_elements) != 0:
        video_element = video_elements[0]
        url = video_element.get_attribute('src')

        filename = url.split("/")[-1]
        # filename = utils.gen_file_name(slide_no)

        # Download Image
        src = utils.download_resource(url, dest_dir + '/src', filename)
    
        scorm_slide['data']['src'] = src
        scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)
    
    return True, scorm_slide
    # print(str(scorm_obj))

