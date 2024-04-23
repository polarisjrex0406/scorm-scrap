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
        drag_elemet = slide_container.find_element(By.XPATH, ".//div[@role='button' and @tabindex and not(preceding-sibling::*) and not(following-sibling::*) and parent::div]")
    except NoSuchElementException as e:
        # Check Slide Type is Matching
        return False, ''
        
    ret_obj = []
    sorting_data = {'type': 'sorting', 'data': {'count': 0, 'data': [], 'sorting':[]}}
    

    # print(drag_elemet.text)
    sort_wrap_elemet = drag_elemet.find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..")
    sorting_box = sort_wrap_elemet.find_element(By.XPATH, "..")
    sort_card_elemet = sort_wrap_elemet.find_element(By.XPATH, "following-sibling::*[2]")
    sort_button_elements = sort_card_elemet.find_elements(By.XPATH, ".//button[@tabindex]")
    # print(len(sort_button_elements))
    i = 0
    for sort_button_element in sort_button_elements:
        sorting_data['data']['sorting'].append({'id': i, 'text': sort_button_element.text})
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
                driver.execute_script("arguments[0].scrollIntoView(true);", sort_button_element)
                sort_button_element.click()
                time.sleep(3)
                drag_elemet = slide_container.find_element(By.XPATH, ".//div[@role='button' and @tabindex]")
                if sort_element_text != drag_elemet.text:
                    sort = i
                    sort_element_obj['sort'] = i
                    sorting_data['data']['data'].append(sort_element_obj)
                    break
        except NoSuchElementException:
            if i != -1:
                sort_element_obj['sort'] = i
                sorting_data['data']['data'].append(sort_element_obj)
            break
 
    
    driver.execute_script("arguments[0].classList.add('sorting-box');", sorting_box)
    driver.execute_script("arguments[0].classList.add('sorting-wrap');", sort_wrap_elemet)
    driver.execute_script("arguments[0].classList.add('sorting-card');", sort_card_elemet)
    sorting_data['data']['count'] = len(sorting_data['data']['data'])
    ret_obj.append(sorting_data)    

    return True, ret_obj
    # print(str(scorm_obj))

