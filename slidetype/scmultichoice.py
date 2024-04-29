import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir, question_count):

    print('###### Scrap Multiple Choices ######')

    # Scrap multiple choice
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    try:
        select_tag_element = slide_container.find_element(By.XPATH, ".//div[text()='Select one']")
    except NoSuchElementException as e:
        return False, '', question_count

    ret_obj = []
    multichoice_data = {'type': 'multichoice', 'data': {'count': 0, 'value': -1, 'choice':[]}, 'question_id': question_count}
    question_count = question_count + 1

    multichoice_box = select_tag_element.find_element(By.XPATH, "following-sibling::*[1]")
    choice_elements = multichoice_box.find_elements(By.XPATH, "./*")
    multichoice_data['data']['count'] = len(choice_elements)

    i = 0
    for choice_element in choice_elements:
        content_element = choice_element.find_element(By.XPATH, ".//div[@contenteditable]")
        choice_text = content_element.text
        multichoice_data['data']['choice'].append({'id':i, 'text': choice_text})
        i = i + 1
    choice_elements[0].click()
    time.sleep(1)
    check_button_element = slide_container.find_element(By.XPATH, ".//button[text()='Check' or text()='Next']")
    check_button_element.click()
    time.sleep(1)
    i = -1
    for choice_element in choice_elements:
        i = i + 1
        if "d=\"M4.5 12.75l6 6 9-13.5\"" in choice_element.get_attribute('innerHTML'):
            print("#############################################################")
            multichoice_data['data']['value'] = i
            break
   
    driver.execute_script("arguments[0].classList.add('multichoice-box');", multichoice_box)
    driver.execute_script("arguments[0].classList.add('choice-check');", check_button_element)
    time.sleep(1)
    ret_obj.append(multichoice_data)    
    return True, ret_obj, question_count
    # print(str(scorm_obj))

