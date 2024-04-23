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

    ret_obj = []
    accord_data = {'type': 'accordian', 'data': {'count': 0, 'accord':[]}}
    accord_data['data']['count'] = len(accord_tag_elements)

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
        accord_data['data']['accord'].append({'tag': tag, 'exp': exp})

        accord_box = btn_element = accord_tag_element.find_element(By.XPATH, "../../../..")
        driver.execute_script("arguments[0].classList.add('accord-box');", accord_box)

    ret_obj.append(accord_data)
    return True, ret_obj
    # print(str(scorm_obj))

