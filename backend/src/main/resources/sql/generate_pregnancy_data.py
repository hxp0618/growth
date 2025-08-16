#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成完整的280天孕期进度数据
基于现实世界胎儿发育情况
"""

import math

def calculate_baby_weight(days_to_delivery):
    """根据距离预产期天数计算宝宝体重(克)"""
    # 280天孕期，体重从0.001g到3200g的真实增长曲线
    days_passed = 280 - days_to_delivery
    
    if days_passed <= 28:  # 前4周，极微小
        return 0.001 + (days_passed / 28) * 0.071
    elif days_passed <= 56:  # 5-8周，缓慢增长
        return 0.072 + ((days_passed - 28) / 28) * 0.606
    elif days_passed <= 84:  # 9-12周，开始增长
        return 0.678 + ((days_passed - 56) / 28) * 3.339
    elif days_passed <= 140:  # 13-20周，中等增长
        return 4.017 + ((days_passed - 84) / 56) * 75.983
    elif days_passed <= 196:  # 21-28周，快速增长
        return 80.0 + ((days_passed - 140) / 56) * 740.0
    else:  # 29-40周，最快增长
        return 820.0 + ((days_passed - 196) / 84) * 2380.0

def get_fruit_comparison(weight):
    """根据体重获取水果对比（更准确的对应关系）"""
    if weight < 0.01:
        return "针尖"
    elif weight < 0.1:
        return "芝麻粒"
    elif weight < 0.5:
        return "罂粟籽"
    elif weight < 1.0:
        return "苹果籽"
    elif weight < 2.0:
        return "橘子籽"
    elif weight < 5.0:
        return "豌豆"
    elif weight < 10.0:
        return "蓝莓"
    elif weight < 20.0:
        return "覆盆子"
    elif weight < 50.0:
        return "樱桃"
    elif weight < 100.0:
        return "草莓"
    elif weight < 200.0:
        return "无花果"
    elif weight < 400.0:
        return "青柠"
    elif weight < 600.0:
        return "桃子"
    elif weight < 800.0:
        return "柠檬"
    elif weight < 1200.0:
        return "苹果"
    elif weight < 1600.0:
        return "鳄梨"
    elif weight < 2000.0:
        return "洋葱"
    elif weight < 2500.0:
        return "甜椒"
    elif weight < 3000.0:
        return "番茄"
    elif weight < 4000.0:
        return "香蕉"
    elif weight < 5000.0:
        return "胡萝卜"
    elif weight < 6000.0:
        return "木瓜"
    elif weight < 8000.0:
        return "芒果"
    elif weight < 10000.0:
        return "玉米"
    elif weight < 15000.0:
        return "花菜"
    elif weight < 20000.0:
        return "生菜"
    elif weight < 30000.0:
        return "花椰菜"
    elif weight < 50000.0:
        return "茄子"
    elif weight < 80000.0:
        return "南瓜"
    elif weight < 120000.0:
        return "卷心菜"
    elif weight < 180000.0:
        return "椰子"
    elif weight < 300000.0:
        return "菠萝"
    elif weight < 500000.0:
        return "菠萝蜜"
    elif weight < 800000.0:
        return "哈密瓜"
    elif weight < 1200000.0:
        return "蜜瓜"
    elif weight < 1800000.0:
        return "罗马甜瓜"
    elif weight < 2400000.0:
        return "瑞士甜瓜"
    elif weight < 3000000.0:
        return "冬瓜"
    else:
        return "西瓜"

def get_encouragement_message(week, days_to_delivery):
    """根据孕期周数获取鼓励话语"""
    messages = {
        1: ["生命的奇迹开始了！", "受精卵开始分裂！", "细胞快速分裂中！", "向子宫移动中！", "开始着床！", "着床进行中！", "第一周完成！"],
        2: ["胚胎开始形成！", "细胞分化开始！", "神经系统发育！", "心脏开始发育！", "各系统分化中！", "脊柱开始形成！", "第二周完成！"],
        3: ["心脏开始跳动！", "血管系统发育！", "神经管闭合！", "四肢开始萌芽！", "眼睛开始形成！", "消化系统发育！", "第三周完成！"],
        4: ["大脑快速发育！", "四肢开始伸长！", "耳朵开始形成！", "肝脏开始发育！", "肾脏开始形成！", "胰腺开始发育！", "第四周完成！"],
        5: ["面部开始形成！", "鼻孔开始形成！", "手指开始分化！", "脚趾开始出现！", "眼睑开始形成！", "舌头开始发育！", "第五周完成！"],
        6: ["心脏四腔结构形成！", "大脑皮层发育！", "肺部开始发育！", "胃部开始形成！", "骨骼开始硬化！", "肌肉开始发育！", "第六周完成！"],
        7: ["手臂开始弯曲！", "腿部开始伸长！", "眼睛开始有色素！", "嘴唇开始形成！", "牙胚开始发育！", "性腺开始分化！", "第七周完成！"],
        8: ["大脑快速发育！", "手指分离完成！", "脚趾完全分开！", "尾巴开始消失！", "外生殖器发育！", "肾脏产生尿液！", "胚胎期结束！"],
        9: ["胎儿期开始！", "头部快速增长！", "眼睑融合保护眼睛！", "耳朵移到正确位置！", "肌肉开始收缩！", "反射开始出现！", "第九周完成！"],
        10: ["重要器官都已形成！", "手腕开始弯曲！", "脚踝形成！", "指甲开始生长！", "毛发毛囊形成！", "牙胚继续发育！", "第十周完成！"],
        11: ["快速成长期开始！", "身长快速增加！", "头部比例协调！", "肠道开始蠕动！", "肾脏集中尿液！", "骨骼开始硬化！", "第十一周完成！"],
        12: ["孕早期即将结束！", "声带开始形成！", "肌肉力量增加！", "反射更加明显！", "肠道出现胎粪！", "骨髓产生血细胞！", "孕早期结束！"],
        13: ["孕中期开始！", "头部比例协调！", "眉毛睫毛生长！", "肝脏产生胆汁！", "胰腺产生胰岛素！", "指纹开始形成！", "第十三周完成！"],
        14: ["面部肌肉发育！", "吞咽反射完善！", "呼吸肌练习！", "甲状腺开始工作！", "脾脏产生红血球！", "听觉系统发育！", "第十四周完成！"],
        15: ["听觉系统成熟！", "腿部比手臂长！", "皮肤开始变厚！", "味蕾开始发育！", "眼睛开始感光！", "关节更加灵活！", "第十五周完成！"],
        16: ["性别特征明显！", "脐带完全发育！", "循环系统完善！", "神经系统快速发育！", "胎动可能被感觉到！", "免疫系统发育！", "第十六周完成！"],
        17: ["胎动越来越明显！", "骨骼继续硬化！", "胎脂开始形成！", "汗腺开始发育！", "听觉更加敏感！", "肌肉力量增强！", "第十七周完成！"],
        18: ["听觉完全发育！", "可以听到外界声音！", "胎动更加频繁！", "睡眠周期建立！", "消化系统完善！", "免疫系统加强！", "第十八周完成！"],
        19: ["皮肤开始变厚！", "保护性胎脂形成！", "头发开始生长！", "肾脏功能完善！", "肺部继续发育！", "神经系统成熟！", "第十九周完成！"],
        20: ["恭喜！孕期过半！", "宝宝在快速成长！", "器官功能完善！", "胎动规律化！", "听觉非常敏感！", "大脑快速发育！", "第二十周完成！"],
        21: ["快速体重增长期！", "营养需求增加！", "骨骼快速发育！", "肌肉力量增强！", "反射更加完善！", "睡眠模式建立！", "第二十一周完成！"],
        22: ["听觉敏感期！", "多和宝宝说话！", "大脑皮层发育！", "眼睛快速发育！", "肺部开始成熟！", "消化系统完善！", "第二十二周完成！"],
        23: ["肺部开始发育！", "为出生做准备！", "大脑沟回形成！", "视觉系统发育！", "听觉更加敏锐！", "胎动更有力！", "第二十三周完成！"],
        24: ["加油！每一天都在见证奇迹的发生✨", "大脑快速发育！", "肺部表面活性物质产生！", "视网膜发育完善！", "听觉系统成熟！", "存活率大大提高！", "第二十四周完成！"],
        25: ["手部精细动作发育！", "小手很灵活！", "大脑皮层快速发育！", "肺部继续成熟！", "视觉系统完善！", "胎动模式建立！", "第二十五周完成！"],
        26: ["眼睛开始睁开！", "视觉系统在发育！", "大脑快速增长！", "肺部接近成熟！", "免疫系统加强！", "胎动更加规律！", "第二十六周完成！"],
        27: ["大脑皮层快速发育！", "越来越聪明！", "肺部继续成熟！", "眼睛可以睁开闭合！", "听觉非常敏感！", "胎动很有力！", "第二十七周完成！"],
        28: ["进入孕晚期！", "宝宝正在为出生做准备！", "肺部快速成熟！", "大脑发育完善！", "免疫系统强化！", "存活率很高！", "孕中期结束！"],
        29: ["孕晚期开始！", "宝宝成长加速！", "骨骼快速硬化！", "肺部接近成熟！", "大脑皮层完善！", "胎动更有规律！", "第二十九周完成！"],
        30: ["快速体重增长！", "宝宝越来越重！", "肺部表面活性剂增加！", "大脑快速发育！", "免疫系统成熟！", "准备最后冲刺！", "第三十周完成！"],
        31: ["肺部快速成熟！", "呼吸系统完善！", "大脑皮层发育完善！", "骨骼继续硬化！", "胎动空间减少！", "准备出生！", "第三十一周完成！"],
        32: ["骨骼继续硬化！", "宝宝越来越强壮！", "肺部接近完全成熟！", "大脑发育完善！", "免疫系统强化！", "胎位开始固定！", "第三十二周完成！"],
        33: ["免疫系统成熟！", "宝宝有了抵抗力！", "肺部功能完善！", "大脑皮层成熟！", "骨骼硬化完成！", "准备迎接世界！", "第三十三周完成！"],
        34: ["中枢神经系统成熟！", "大脑发育完善！", "肺部完全成熟！", "免疫系统强大！", "各器官功能完善！", "随时准备出生！", "第三十四周完成！"],
        35: ["肺部接近成熟！", "随时准备呼吸！", "大脑发育完成！", "免疫系统完善！", "各器官准备就绪！", "足月在望！", "第三十五周完成！"],
        36: ["宝宝已经足月了！", "随时准备迎接新生命！", "肺部完全成熟！", "所有器官功能完善！", "免疫系统强大！", "准备见面！", "第三十六周完成！"],
        37: ["足月儿！", "随时可能出生！", "准备好了吗？", "所有系统成熟！", "宝宝准备好了！", "随时迎接新生命！", "第三十七周完成！"],
        38: ["所有器官完全成熟！", "宝宝准备好了！", "肺部功能完善！", "大脑发育完成！", "免疫系统强大！", "随时准备出生！", "第三十八周完成！"],
        39: ["准备迎接宝宝！", "马上就要见面了！", "一切准备就绪！", "宝宝迫不及待了！", "最后的等待！", "新生命即将到来！", "第三十九周完成！"],
        40: ["预产期到了！", "宝宝即将来到这个世界！", "恭喜你即将成为妈妈！", "280天的等待即将结束！", "新的人生即将开始！", "迎接小天使！", "足月完成！"]
    }
    
    week_messages = messages.get(week, ["宝宝在健康成长！"])
    day_in_week = (280 - days_to_delivery) % 7
    if day_in_week < len(week_messages):
        return week_messages[day_in_week]
    return week_messages[0]

def generate_sql():
    """生成完整的280天SQL数据"""
    sql_lines = [
        "-- 孕期进度完整280天数据",
        "-- 基于现实世界胎儿发育情况生成",
        "",
        "DELETE FROM `pregnancy_progress`;",
        "",
        "INSERT INTO `pregnancy_progress` (`id`, `pregnancy_week`, `progress_percentage`, `days_to_delivery`, `baby_weight`, `fruit_comparison`, `encouragement_message`, `status`, `create_time`, `update_time`, `create_by`, `update_by`, `is_deleted`, `version`) VALUES"
    ]
    
    values = []
    for day in range(1, 281):  # 1到280天
        days_to_delivery = 280 - day
        week = math.ceil(day / 7)
        progress_percentage = round(day / 280 * 100, 2)
        baby_weight = round(calculate_baby_weight(days_to_delivery), 3)
        fruit_comparison = get_fruit_comparison(baby_weight)
        encouragement_message = get_encouragement_message(week, days_to_delivery)
        
        value = f"({day}, {week}, {progress_percentage}, {days_to_delivery}, {baby_weight}, '{fruit_comparison}', '{encouragement_message}', 1, NOW(), NOW(), NULL, NULL, 0, 1)"
        values.append(value)
    
    # 将所有值连接，每行一个
    sql_lines.extend([v + ("," if i < len(values) - 1 else ";") for i, v in enumerate(values)])
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    sql_content = generate_sql()
    with open("pregnancy_progress_complete_280_days.sql", "w", encoding="utf-8") as f:
        f.write(sql_content)
    print("已生成完整的280天孕期进度数据文件: pregnancy_progress_complete_280_days.sql")
    print(f"总共生成了280条记录")