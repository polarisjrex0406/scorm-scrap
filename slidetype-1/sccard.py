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

    scorm_slide = {'type': 'card', 'data': {'count': 0, 'card':[], 'header':''}}
    scorm_slide['data']['count'] = len(card_elemets)

    h1_elements = slide_container.find_elements(By.XPATH, "//h1 | //h2")
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        scorm_slide['data']['header'] = h1_element.get_attribute('innerHTML')
    for card_elemet in card_elemets:
        front_card = card_elemet.find_element(By.CSS_SELECTOR, ".flip-card-front")
        front_txt_element = front_card.find_element(By.CSS_SELECTOR, ".whitespace-pre-wrap")
        front_txt = front_txt_element.get_attribute('innerHTML')
        back_card = card_elemet.find_element(By.CSS_SELECTOR, ".flip-card-back")
        back_txt_element = back_card.find_element(By.CSS_SELECTOR, ".whitespace-pre-wrap")
        back_txt = back_txt_element.get_attribute('innerHTML')

        scorm_slide['data']['card'].append({'front': front_txt, 'back': back_txt})
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

    return True, scorm_slide
    # print(str(scorm_obj))

