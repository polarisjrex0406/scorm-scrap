import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Accordian ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    accord_tag_elements = slide_container.find_elements(By.XPATH, "//div[child::*[@variant='blend']]")

    # Check Slide Type is Matching
    if len(accord_tag_elements) == 0:
        return False, ''

    scorm_slide = {'type': 'accordian', 'data': {'count': 0, 'accord':[], 'header':''}}
    scorm_slide['data']['count'] = len(accord_tag_elements)

    h1_elements = slide_container.find_elements(By.XPATH, "//h1 | //h2")
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        scorm_slide['data']['header'] = h1_element.get_attribute('innerHTML')
    for accord_tag_element in accord_tag_elements:
        btn_element = accord_tag_element.find_element(By.XPATH, "..")
        tag_element = accord_tag_element.find_element(By.XPATH, "./*[1]")
        accord_element = btn_element.find_element(By.XPATH, "..")

        btn_element.click()
        time.sleep(1)
        exlain_div_element = accord_element.find_element(By.XPATH, "./*[2]")
        explain_elemet = exlain_div_element.find_element(By.CSS_SELECTOR, ".whitespace-pre-wrap")
        tag = tag_element.get_attribute('innerHTML')
        exp = explain_elemet.get_attribute('innerHTML')
        # print(tag)
        # print(exp)
        scorm_slide['data']['accord'].append({'tag': tag, 'exp': exp})

    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

    return True, scorm_slide
    # print(str(scorm_obj))

