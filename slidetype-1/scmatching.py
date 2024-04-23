import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Matching ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    scorm_slide = {'type': 'matching', 'data': {'count': 0, 'matches':[], 'header':''}}
    match_elements = slide_container.find_elements(By.XPATH, "//button[@tabindex and "
    "descendant::div[@role='button' and @aria-roledescription='draggable'] and "
    "following-sibling::div[@class='relative']]")

    # Check Slide Type is Matching
    if len(match_elements) == 0:
        return False, ''

    h1_elements = slide_container.find_elements(By.XPATH, "//h1 | //h2")
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        scorm_slide['data']['header'] = h1_element.get_attribute('innerHTML')

    match_wrap_elements = []
    match_wrap_elements_temp = []
    scorm_slide['data']['count'] = len(match_elements)

    check_wrap_element = match_elements[0].find_element(By.XPATH, "../../..")
    check_button_element = check_wrap_element.find_element(By.XPATH, ".//button[text()='Check']")

    for match_element in match_elements:
        # print(match_element.get_attribute('innerHTML'))
        match_rel_element = match_element.find_element(By.XPATH, "following-sibling::*[1]")
        match_wrap_elements.append(match_element.find_element(By.XPATH, ".."))
        match_wrap_elements_temp.append(match_element.find_element(By.XPATH, ".."))
        match_element.click()
        match_rel_element.click()
    
    check_button_element.click()
    time.sleep(1)
    # pdb.set_trace()

    remove_match_temp = []
    for match_wrap_element in match_wrap_elements:
        
        if "d=\"M4.5 12.75l6 6 9-13.5\"" not in match_wrap_element.get_attribute('innerHTML'):
            # print(match_wrap_element.get_attribute('innerHTML'))
            match_rel_element = match_wrap_element.find_element(By.XPATH, "./*[2]")
            match_rel_element.click()
        else:
            remove_match_temp.append(match_wrap_element)
            # print(len(match_wrap_elements))
    # # print()
    for remove_match in remove_match_temp:
        match_wrap_elements.remove(remove_match)

    # print(len(match_wrap_elements))
    while len(match_wrap_elements) != 0:
            match_wrap_element = match_wrap_elements[0]
            
            
            for match_wrap_element_rel in match_wrap_elements:
                match_rel_element = match_wrap_element_rel.find_element(By.XPATH, "./*[2]")
                match_element = match_wrap_element.find_element(By.XPATH, "./*[1]")
                match_element.click()
                match_rel_element.click()
                time.sleep(0.5)
                if "d=\"M4.5 12.75l6 6 9-13.5\"" in match_wrap_element_rel.get_attribute('innerHTML'):
                    match_wrap_elements.remove(match_wrap_element_rel)
                    break
                else:
                    match_rel_element.click()
                    # time.sleep(0.5)
                time.sleep(1)
    for match_wrap_element in match_wrap_elements_temp:
        match_element = match_wrap_element.find_element(By.XPATH, "./*[2]").find_element(By.XPATH, "./*[1]")
        match_rel_element = match_wrap_element.find_element(By.XPATH, "./*[2]").find_element(By.XPATH, "./*[2]")
        scorm_slide['data']['matches'].append({'first': match_element.text, 'second': match_rel_element.text})

    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

    return True, scorm_slide
    # print(str(scorm_obj))

