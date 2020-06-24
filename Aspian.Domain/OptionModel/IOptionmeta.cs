using System;
using Aspian.Domain.BaseModel;

namespace Aspian.Domain.OptionModel
{
    public interface IOptionmeta : IEntityBase, IEntityModify, IEntityInfo
    {
        string PublicKeyName { get; set; }
        KeyEnum Key { get; set; }
        string KeyDescription { get; set; }
        ValueEnum Value { get; set; }
        string ValueDescription { get; set; }
        ValueEnum DefaultValue { get; set; }
        string DefaultValueDescription { get; set; }
        string AdditionalInfo { get; set; }

        #region Navigation Properties
        Guid OptionId { get; set; }
        Option Option { get; set; }
        #endregion
    }

    public enum KeyEnum
    {
        Activity__LoggingActivities,
        Activity__PruningDate,

        Attachment__Photo_Png,
        Attachment__Photo_Jpg,
        Attachment__Photo_Bmp,
        Attachment__Photo_Gif,
        Attachment__Photo_Svg,

        Attachment__Video_3gp,
        Attachment__Video_Avi,
        Attachment__Video_Flv,
        Attachment__Video_Wmv,
        Attachment__Video_Mp4,
        Attachment__Video_Mpeg,
        Attachment__Video_Mkv,

        Attachment__Audio_Wma,
        Attachment__Audio_Mp3,

        Attachment__Text_Pdf,

        Attachment__Text_Txt,
        Attachment__Text_Rtf,
        Attachment__Text_Doc,
        Attachment__Text_Docx,
        Attachment__Text_Xls,
        Attachment__Text_Xlsx,

        Attachment__Compressed_Zip,
        Attachment__Compressed_Rar,
        Attachment__Compressed_7z
    }

    public enum ValueEnum
    {
        /// <summary>
        /// Disable Avtivity Logging
        /// </summary>
        Activity__LoggingActivities_Disable,
        /// <summary>
        /// Enable Avtivity Logging
        /// </summary>
        Activity__LoggingActivities_Enable,
        Activity__PruningDate_EveryDay,
        Activity__PruningDate_EveryWeek,
        Activity__PruningDate_EveryTwoWeeks,
        Activity__PruningDate_EveryMonth,
        Activity__PruningDate_EveryThreeMonth,
        Activity__PruningDate_EverySixMonth,
        Activity__PruningDate_EveryYear,

        Attachments__Allowed,
        Attachments__NotAllowed

    }
}