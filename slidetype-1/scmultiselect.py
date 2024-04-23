import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Multiple Select ######')

    # Scrap multiple choice
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    scorm_slide = {'type': 'multichoice', 'data': {'count': 0, 'value': -1, 'choice':[]}}
    try:
        select_tag_element = slide_container.find_element(By.XPATH, ".//div[text()='Select one']")
    except NoSuchElementException as e:
        return False, ''
    choice_elements = select_tag_element.find_element(By.XPATH, "following-sibling::*[1]").find_elements(By.XPATH, "./*")
    scorm_slide['data']['count'] = len(choice_elements)

    i = 0
    for choice_element in choice_elements:
        content_element = choice_element.find_element(By.XPATH, ".//div[@contenteditable]")
        choice_text = content_element.text
        scorm_slide['data']['choice'].append({'id':i, 'text': choice_text})
        i = i + 1
    choice_elements[0].click()
    time.sleep(1)
    check_button_element = select_tag_element.find_element(By.XPATH, ".//following-sibling::*[button[text()='Check']][1]")
    check_button_element.click()
    time.sleep(1)
    i = -1
    for choice_element in choice_elements:
        i = i + 1
        if "d=\"M4.5 12.75l6 6 9-13.5\"" in choice_element.get_attribute('innerHTML'):
            scorm_slide['data']['value'] = i
            break
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

    return True, scorm_slide
    # print(str(scorm_obj))

