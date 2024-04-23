import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Card ######')
    # Scrap Card
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    card_elemets = slide_container.find_elements(By.CSS_SELECTOR, "div.flip-card")

    if len(card_elemets) == 0:
        return False, ''
    ret_obj = []
    
    card_data = {'type': 'card', 'data': {'count': 0, 'card':[]}}
    card_data['data']['count'] = len(card_elemets)

    card_box = card_elemets[0].find_element(By.XPATH, "..").find_element(By.XPATH, "..").find_element(By.XPATH, "..")
    for card_elemet in card_elemets:
        front_card = card_elemet.find_element(By.CSS_SELECTOR, ".flip-card-front")
        front_txt_element = front_card.find_element(By.CSS_SELECTOR, ".whitespace-pre-wrap")
        front_txt = front_txt_element.get_attribute('innerHTML')
        back_card = card_elemet.find_element(By.CSS_SELECTOR, ".flip-card-back")
        back_txt_element = back_card.find_element(By.CSS_SELECTOR, ".whitespace-pre-wrap")
        back_txt = back_txt_element.get_attribute('innerHTML')

        card_data['data']['card'].append({'front': front_txt, 'back': back_txt})

    driver.execute_script("arguments[0].classList.add('card-box');", card_box)
    ret_obj.append(card_data)    
    return True, ret_obj
    # print(str(scorm_obj))

