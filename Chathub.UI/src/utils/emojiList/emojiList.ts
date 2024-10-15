
export type Emoji = {
    code: number,
    name: string,
}

export const emojiList: Emoji[] = [
    {
        code: 0x1F600,
        name: "grinning"
    },
    {
        code: 0x1F601,
        name: "grinning_with_smiling",
    },
    {
        code: 0x1F602,
        name: "joy"
    },
    {
        code: 0x1F603,
        name: "smiling_with_open_mouth"
    },
    {
        code: 0x1F604,
        name: "smiling_with_open_mouth_and_smiling_eyes"
    },
    {
        code: 0x1F605,
        name: "smiling_with_open_mouth_and_cold_sweat"
    },
    {
        code: 0x1F606,
        name: "smiling_with_open_mouth_and_closed_eyes"
    },
    {
        code: 0x1F607,
        name: "smiling_with_halo"
    },
    {
        code: 0x1F608,
        name: "smiling_with_horns"
    },
    {
        code: 0x1F609,
        name: "winking"
    },
    {
        code: 0x1F60A,
        name: "smiling_with_smiling_eyes"
    },
    {
        code: 0x1F60B,
        name: "yum"
    },
    {
        code: 0x1F60C,
        name: "relieved"
    },
    {
        code: 0x1F60D,
        name: "heart_eyes"
    },
    {
        code: 0x1F60E,
        name: "sunglasses"
    },
    {
        code: 0x1F60F,
        name: "smirking"
    },
    {
        code: 0x1F610,
        name: "neutral"
    },
    {
        code: 0x1F611,
        name: "experssionless"
    },
    {
        code: 0x1F612,
        name: "unamused"
    },
    {
        code: 0x1F613,
        name: "cold_sweat"
    },
    {
        code: 0x1F614,
        name: "pensive"
    },
    {
        code: 0x1F615,
        name: "confused"
    },
    {
        code: 0x1F616,
        name: "confounded"
    },
    {
        code: 0x1F617,
        name: "kissing"
    },
    {
        code: 0x1F618,
        name: "throwing_kiss"
    },
    {
        code: 0x1F619,
        name: "kissing_with_smiling_eyes"
    },
    {
        code: 0x1F61A,
        name: "kissing_with_closed_eyes"
    },
    {
        code: 0x1F61B,
        name: "stuck_out_tongue"
    },
    {
        code: 0x1F61C,
        name: "stuck_out_tongue_and_winking_eyes"
    },
    {
        code: 0x1F61D,
        name: "stuck_out_tongue_and_closed_eyes"
    },
    {
        code: 0x1F61E,
        name: "disappointed"
    },
    {
        code: 0x1F61F,
        name: "worried"
    },
    {
        code: 0x1F620,
        name: "angry"
    },
    {
        code: 0x1F621,
        name: "pouting"
    },
    {
        code: 0x1F622,
        name: "crying"
    },
    {
        code: 0x1F623,
        name: "persevering"
    },
    {
        code: 0x1F624,
        name: "triump"
    },
    {
        code: 0x1F625,
        name: "disappointed_but_relieved"
    },
    {
        code: 0x1F626,
        name: "frowning"
    },
    {
        code: 0x1F627,
        name: "anguished"
    },
    {
        code: 0x1F628,
        name: "fearful"
    },
    {
        code: 0x1F629,
        name: "weary"
    },
    {
        code: 0x1F62A,
        name: "sleepy"
    },
    {
        code: 0x1F62B,
        name: "tired"
    },
    {
        code: 0x1F62C,
        name: "grimacing"
    },
    {
        code: 0x1F62D,
        name: "sob"
    },
    {
        code: 0x1F62E,
        name: "open_mouth"
    },
    {
        code: 0x1F62F,
        name: "hushed"
    },
    {
        code: 0x1F630,
        name: "open_mouth_and_cold_sweat"
    },
    {
        code: 0x1F631,
        name: "screaming"
    },
    {
        code: 0x1F632,
        name: "astonished"
    },
    {
        code: 0x1F633,
        name: "flushed"
    },
    {
        code: 0x1F634,
        name: "sleeping"
    },
    {
        code: 0x1F635,
        name: "dizzy"
    },
    {
        code: 0x1F636,
        name: "without_mouth"
    },
    {
        code: 0x1F637,
        name: "medical_mask"
    }
]

export function getEmojiByName(name: string): Emoji | null {
    let result = emojiList.filter(e => e.name === name);
    if(result.length > 0) {
        return result[0];
    }
    return null;
}

export function getEmojiByCode(code: number): Emoji | null {
    let result = emojiList.filter(e => e.code === code);
    if(result.length > 0) {
        return result[0];
    }
    return null;
}