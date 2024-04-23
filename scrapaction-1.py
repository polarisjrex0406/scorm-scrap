import os
import requests
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
# from subprocess import CREATE_NO_WINDOW

from urllib.parse import urljoin
import time
import re
import json
import pdb
import utils

from PyQt6.QtWidgets import QApplication, QMainWindow, QDialog, QMessageBox
from PyQt6.QtCore import Qt
from PyQt6 import uic

from slidetype import scmatching
from slidetype import scaccordian
from slidetype import scfinish
from slidetype import scsorting
from slidetype import scmultichoice
from slidetype import sccard
from slidetype import scstatic
from slidetype import scsectiondivider
from slidetype import scblankparagraph
from slidetype import scvideo
from slidetype import scmain

from PyQt6.QtCore import pyqtSignal, QObject, QThread

import shutil


class ScrapWorker(QObject):
    def __init__(self, url, dest_dir, show_brower, start_signal, finished_signal, error_signal, step_signal):
        super().__init__()
        self.url = url
        self.dest_dir = dest_dir
        self.show_brower = show_brower
        self.start_signal = start_signal
        self.finished_signal = finished_signal
        self.error_signal = error_signal
        self.step_signal = step_signal
        
    def set_url(self, url):
        self.url = url
    def set_dest_dir(self, dest_dir):
        self.dest_dir = dest_dir
    def set_show_brower(self, show_brower):
        self.show_brower = show_brower
    def do_work(self):
        scorm_obj = {
            'slides': []
        }

        # Preparing Base Files
        if os.path.exists(self.dest_dir):
            shutil.rmtree(self.dest_dir)
        try:
            shutil.copytree('./base', self.dest_dir)
            print("Folder copied successfully!")
        except shutil.Error as e:
            print(f"Folder not copied: {e}")
        except OSError as e:
            print(f"Folder not copied: {e}")


        slide_no = 0
        print('Scrapping Started')
        print(self.url)

        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--window-size=0,0")
        # chrome_options.creationflags = CREATE_NO_WINDOW
        chrome_options.experimental_options
        driver = webdriver.Chrome(options = chrome_options)
        driver.get(self.url)
        time.sleep(3)
        # page_source = driver.page_source

        self.start_signal.emit()
        # Scrap Background Image
        first_div = driver.find_element(By.CSS_SELECTOR, "body > div:first-child")
        second_div = first_div.find_element(By.CSS_SELECTOR, "div:nth-child(2)")
        background_image_url = second_div.value_of_css_property("background-image")
        background_image_url = re.search('url\("(.+)"\)', background_image_url).group(1)
        print(background_image_url)
        self.step_signal.emit('Background Image')
        utils.download_resource(background_image_url, self.dest_dir + "/scorm/src", 'background-image.png')
        print('Backroud image downloaded successfully')

        # Scrap Lesson Title
        # Get slide-container
        # self.step_signal.emit('Title')
        # slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
        # title_h1_element = slide_container.find_element(By.CSS_SELECTOR, "h1")
        # print(title_h1_element.text)

        # scorm_obj["slides"].append({'type':'title', 'data': {'header': title_h1_element.text}, 'audio': {'src':'', 'script':''}})
        
        # next_step(driver)

        while not scfinish.check_do(driver):
            
            slide = scmain.do(driver, slide_no, self.dest_dir + "/scorm")
            # Scrap Matching
            check, slide = scmatching.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Matching')
                next_step(driver)
                continue

            # Scrap Accordian
            check, slide = scaccordian.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Accordian')
                next_step(driver)
                continue

            # Scrap Sorting
            check, slide = scsorting.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Sorting')
                next_step(driver)
                continue

            # Scrap Multiple Choice
            check, slide = scmultichoice.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Multiple Choice')
                next_step(driver)
                continue

            # Scrap Card
            check, slide = sccard.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Card')
                next_step(driver)
                continue

            # Scrap Static
            check, slide = scstatic.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Image Static')
                next_step(driver)
                continue
            # Scrap Video
            check, slide = scvideo.check_do(driver, slide_no,  self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Video')
                next_step(driver)
                continue

            # Scrap Section Divider
            check, slide = scsectiondivider.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Section Divider')
                next_step(driver)
                continue

            # Scrap Black Paragraph
            check, slide = scblankparagraph.check_do(driver, slide_no, self.dest_dir + "/scorm")
            if check:
                scorm_obj["slides"].append(slide)
                print(slide)
                self.step_signal.emit('Black Paragraph')
                next_step(driver)
                continue
            
            slide_no = slide_no + 1
            # IF none above
            next_step(driver)

        # Scrap 
        # time.sleep(5)

        save_file_path = self.dest_dir + "/scorm" + '/content.js'
        save_content = "var scorm_content = " + json.dumps(scorm_obj)
        with open(save_file_path, 'w') as json_file:
            json_file.write(save_content)
        driver.quit()
        self.finished_signal.emit()


# Get Down Button
def next_step(driver):
    # pointer_event_none = driver.find_element(By.CSS_SELECTOR, ".pointer-events-none")
    next_button = driver.find_elements(By.CSS_SELECTOR, "button.up-btn")[1]
    next_button.click()
    time.sleep(1)


    
# Example usage
# url = "https://app.mindsmith.ai/learn/clulhjwq0001hjv0836qyr72g"

# url = "https://app.mindsmith.ai/learn/clumzq7uq004ojt08mc2cfiub"
# url = "https://app.mindsmith.ai/learn/clur9fs9h000gju0990zioqz6"
# url = "https://app.mindsmith.ai/learn/cluredzba00e1jy09nzpn6e88"
