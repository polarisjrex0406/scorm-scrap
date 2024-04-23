import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Sorting ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")

    try:
        drag_elemet = slide_container.find_element(By.XPATH, ".//div[@role='button' and @tabindex and not(preceding-sibling::*) and not(following-sibling::*)]")
    except NoSuchElementException as e:
        # Check Slide Type is Matching
        return False, ''
        
    
    scorm_slide = {'type': 'sorting', 'data': {'count': 0, 'data': [], 'sorting':[], 'header':''}}
    
    h1_elements = slide_container.find_elements(By.XPATH, "//h1 | //h2")
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        scorm_slide['data']['header'] = h1_element.get_attribute('innerHTML')
    
    # print(drag_elemet.text)
    sort_wrap_elemet = drag_elemet.find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..")

    
    
    sort_card_elemet = sort_wrap_elemet.find_element(By.XPATH, "following-sibling::*[2]")
    sort_button_elements = sort_card_elemet.find_elements(By.XPATH, ".//button[@tabindex]")
    # print(len(sort_button_elements))
    i = 0
    for sort_button_element in sort_button_elements:
        scorm_slide['data']['sorting'].append({'id': i, 'text': sort_button_element.text})
        i = i + 1
    
    sort_element_obj = {'text':'', 'sort': -1}
    while True:
        try:
            i = -1
            drag_elemet = slide_container.find_element(By.XPATH, ".//div[@role='button' and @tabindex]")
            sort_element_text = drag_elemet.text
            sort_element_obj = {'text':sort_element_text, 'sort': -1}
            for sort_button_element in sort_button_elements:
                i = i + 1
                sort_button_element.click()
                time.sleep(3)
                drag_elemet = slide_container.find_element(By.XPATH, ".//div[@role='button' and @tabindex]")
                if sort_element_text != drag_elemet.text:
                    sort = i
                    sort_element_obj['sort'] = i
                    scorm_slide['data']['data'].append(sort_element_obj)
                    break
        except NoSuchElementException:
            if i != -1:
                sort_element_obj['sort'] = i
                scorm_slide['data']['data'].append(sort_element_obj)
            break
 
    time.sleep(1)
    
    scorm_slide['data']['count'] = len(scorm_slide['data']['data'])
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)
  
    return True, scorm_slide
    # print(str(scorm_obj))

